import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const vehicleSchema = z.object({
  model: z.string().min(1, { message: "Model is required" }),
  regNumber: z.string().min(1, { message: "Registration number is required" }),
  type: z.enum(["cargo", "passenger"]),
  fuelConsumption: z
    .number()
    .min(0, { message: "Fuel consumption must be a positive number" }),
  status: z.enum(["available", "unavailable"]),
});

export const maintenanceSchema = z.object({
  vehicleId: z.string().min(1, { message: "Vehicle ID is required" }),
  scheduledDate: z.coerce.date(), // <- penting: pastikan gunakan `z.coerce.date()` agar bisa meng-handle string dari input date
  notes: z.string().min(1, { message: "Notes are required" }),
  status: z.boolean(),
});

export const bookingSchema = z.object({
  vehicleId: z.string().min(1, { message: "Vehicle ID is required" }),
  approver1Id: z.string().min(1, { message: "Approver 1 ID is required" }),
  approver2Id: z.string().min(1, { message: "Approver 2 ID is required" }),
  driverId: z.string().min(1, { message: "Driver ID is required" }),
  destinationId: z.string().min(1, { message: "Destination ID is required" }),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  notes: z.string().min(1, { message: "Notes are required" }),
  distance: z.number().min(0, { message: "Distance must be a positive number" }),
  status: z.enum(["pending", "approved_l1", "approved_l2", "approved", "rejected"]),
}).refine(data => data.endDate > data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"],
});
