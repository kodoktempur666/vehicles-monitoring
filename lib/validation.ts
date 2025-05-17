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
