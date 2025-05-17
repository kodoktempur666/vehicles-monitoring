"use server"
import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import {  vehicles, bookings, users, destinations, drivers, history } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getVehicles = async () => {
  const vehiclesData = await db.select().from(vehicles);

  return vehiclesData;
};

export const getUsers = async () => {
    const usersData = await db.select().from(users);
    
    return usersData;
}

export const getDestinations = async () => {
  const destinationsData = await db.select().from(destinations);

  return destinationsData;
};

export const getDrivers = async () => {
    const driversData = await db.select().from(drivers)

    return driversData;
}

export const getBookings = async () => {
  const bookingsData = await db.select().from(bookings).innerJoin(vehicles, eq(vehicles.id, bookings.vehicleId))
    .innerJoin(users, eq(users.id, bookings.requesterId))
    .innerJoin(drivers, eq(drivers.id, bookings.driverId))
    .innerJoin(destinations, eq(destinations.id, bookings.destinationId));

  return bookingsData;
};

export const createBooking = async (params: BookingParams) => {
  try {
    const session = await auth();
    const requesterId = session?.user?.id;

    if (!requesterId) {
      return { success: false, message: "Unauthorized: User not logged in" };
    }

    let startDate: string | null = null;
    let endDate: string | null = null;

    if (params.startDate) {
      const parsedStartDate = new Date(params.startDate);
      if (!isNaN(parsedStartDate.getTime())) {
        startDate = parsedStartDate.toISOString();
      } else {
        throw new Error("Invalid start date format");
      }
    }

    if (params.endDate) {
      const parsedEndDate = new Date(params.endDate);
      if (!isNaN(parsedEndDate.getTime())) {
        endDate = parsedEndDate.toISOString();
      } else {
        throw new Error("Invalid end date format");
      }
    }

    const newBooking = await db
      .insert(bookings)
      .values({
        ...params,
        requesterId,
        startDate,
        endDate,
      })
      .returning();

    await db
      .update(vehicles)
      .set({
        status: "approval_pending"
      })
      .where(eq(vehicles.id, params.vehicleId));

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newBooking[0])),
    };

  } catch (error) {
    console.error(error);
    return { success: false, message: "An error occurred" };
  }
};

export const updateBookingLevel1 = async (id: string) => {
  try {
    const session = await auth();
    const approverId = session?.user?.id;

    if (!approverId) {
      return { success: false, message: "Unauthorized: User not logged in" };
    }

    // Get approver information
    const approver = await db
      .select({ name: users.name })
      .from(users)
      .where(eq(users.id, approverId))
      .limit(1);

    const updateStatus = await db
      .update(bookings)
      .set({
        status: "approved_lv1",
        approver1Id: approverId,
        approver1Name: approver[0]?.name || null,
      })
      .where(eq(bookings.id, id))
      .returning();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(updateStatus[0])),
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "An error occurred" };
    
  }
}

export const updateBookingLevel2 = async (id: string) => {
  try {
    const session = await auth();
    const approverId = session?.user?.id;

    if (!approverId) {
      return { success: false, message: "Unauthorized: User not logged in" };
    }

    // Get current approver name
    const approver = await db
      .select({ name: users.name })
      .from(users)
      .where(eq(users.id, approverId))
      .limit(1);

    // Update booking with level 2 approval
    const [bookingUpdate] = await db
      .update(bookings)
      .set({
        status: "approved",
        approver2Id: approverId,
        approver2Name: approver[0]?.name || null,
      })
      .where(eq(bookings.id, id))
      .returning();

    if (!bookingUpdate) {
      throw new Error("Booking not found or update failed");
    }

    // Get full booking info after update
    const [fullBooking] = await db
      .select({
        booking: bookings,
        requester: users,
        driver: drivers,
        vehicle: vehicles,
        destination: destinations,
      })
      .from(bookings)
      .innerJoin(users, eq(users.id, bookings.requesterId))
      .innerJoin(drivers, eq(drivers.id, bookings.driverId))
      .innerJoin(vehicles, eq(vehicles.id, bookings.vehicleId))
      .innerJoin(destinations, eq(destinations.id, bookings.destinationId))
      .where(eq(bookings.id, id))
      .limit(1);

    if (!fullBooking) {
      throw new Error("Failed to retrieve complete booking data");
    }

    const { booking, requester, driver, vehicle, destination } = fullBooking;

    // Get approver1 and approver2 names (again, more accurate)
    const [approver1] = await db
      .select({ name: users.name })
      .from(users)
      .where(eq(users.id, booking.approver1Id));

    const [approver2] = await db
      .select({ name: users.name })
      .from(users)
      .where(eq(users.id, booking.approver2Id));

    // Update statuses
    await db
      .update(vehicles)
      .set({ status: "in_use" })
      .where(eq(vehicles.id, booking.vehicleId));

    await db
      .update(drivers)
      .set({ status: "on_duty" })
      .where(eq(drivers.id, booking.driverId));

    // Insert into history table
    await db.insert(history).values({
      requesterId: booking.requesterId,
      requesterName: requester.name,
      approver1Id: booking.approver1Id,
      approver1Name: approver1?.name || null,
      approver2Id: booking.approver2Id,
      approver2Name: approver2?.name || null,
      driverId: booking.driverId,
      driverName: driver.name,
      vehicleId: booking.vehicleId,
      vehicleRegNumber: vehicle.regNumber,
      vehicleModel: vehicle.model,
      destinationId: booking.destinationId,
      destinationName: destination.name,
      destinationDistance: booking.distance,
      startDate: booking.startDate,
      endDate: booking.endDate,
      notes: booking.notes,
    });

    return {
      success: true,
      data: JSON.parse(JSON.stringify(booking)),
    };
  } catch (error) {
    console.error("Error in updateBookingLevel2:", error);
    return { success: false, message: "An error occurred during approval" };
  }
};
