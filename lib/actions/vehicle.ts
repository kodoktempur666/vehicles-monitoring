import { db } from "@/db/drizzle";
import { maintenance, vehicles } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getVehicles = async () => {
  const vehiclesData = await db.select().from(vehicles);

  return vehiclesData;
};

export const getMaintenance = async () => {
  const maintenanceData = await db
    .select()
    .from(maintenance)
    .innerJoin(vehicles, eq(vehicles.id, maintenance.vehicleId));

  return maintenanceData;
};

export const createVehicle = async (params: VehicleParams) => {
  try {
    const newVehicle = await db
      .insert(vehicles)
      .values({
        ...params,
      })
      .returning();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newVehicle[0])),
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "an error occured" };
  }
};

export const createMaintenance = async (params: MaintenanceParams) => {
  try {
    let scheduledDate: string | null = null;

    if (params.scheduledDate) {
      const parsedDate = new Date(params.scheduledDate);
      if (!isNaN(parsedDate.getTime())) {
        scheduledDate = parsedDate.toISOString();
      } else {
        throw new Error("Invalid date format");
      }
    }

    // 1. Insert maintenance record
    const newMaintenance = await db
      .insert(maintenance)
      .values({
        ...params,
        scheduledDate,
      })
      .returning();

    // 2. Update vehicle status
    await db
      .update(vehicles)
      .set({
        status: "maintenance",
      })
      .where(eq(vehicles.id, params.vehicleId));

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newMaintenance[0])),
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "An error occurred" };
  }
};

export const maintenanceStatus = async (id: string) => {
  try {
    const updatedMaintenance = await db
      .update(maintenance)
      .set({ status: false })
      .where(eq(maintenance.id, id))
      .returning();

    const maintenanceRecord = updatedMaintenance[0];

    if (!maintenanceRecord) throw new Error("Maintenance record not found");

    await db
      .update(vehicles)
      .set({ status: "available" })
      .where(eq(vehicles.id, maintenanceRecord.vehicleId));

    return {
      success: true,
      data: JSON.parse(JSON.stringify(maintenanceRecord)),
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "An error occurred" };
  }
};

