import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  date,
} from "drizzle-orm/pg-core";

export const ROLE_ENUM = pgEnum("role", [
  "admin",
  "approver_l1",
  "approver_l2",
]);
export const STATUS_VEHICLE = pgEnum("status_vehicle", [
  "available",
  "maintenance",
  "in_use",
  "approval_pending",
]);
export const STATUS_DRIVER = pgEnum("status_driver", [
  "available",
  "on_duty",
  "on_leave",
]);
export const TYPE_VEHICLE = pgEnum("type_vehicle", ["passenger", "cargo"]);

export const APPROVED = pgEnum("approve_status", [
  "pending",
  "approved_lv1",
  "approved",
  "rejected",
]);

export const users = pgTable("users", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 50 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  role: ROLE_ENUM("role").notNull(),
});

export const destinations = pgTable("destinations", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 255 }).notNull(),
});

export const vehicles = pgTable("vehicles", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  regNumber: varchar("registration_number", { length: 255 }).notNull(),
  fuelConsumption: integer("fuel_consumption").notNull(),
  model: varchar("model", { length: 255 }).notNull(),
  type: TYPE_VEHICLE("type_vehicle").notNull(),
  status: STATUS_VEHICLE("status_vehicle").default("available").notNull(),
});

export const drivers = pgTable("drivers", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  licenseNumber: varchar("license_number", { length: 255 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 255 }).notNull(),
  status: STATUS_DRIVER("status_driver").notNull(),
});

export const maintenance = pgTable("maintenance", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  vehicleId: uuid("vehicle_id")
    .references(() => vehicles.id)
    .notNull(),
  scheduledDate: date("scheduled_date").notNull(),
  status: boolean("status").notNull(),
  notes: text("notes").notNull(),
});

export const bookings = pgTable("bookings", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  requesterId: uuid("requester_id")
    .references(() => users.id)
    .notNull(),
  approver1Id: uuid("approver1_id")
    .references(() => users.id)
    .notNull(),
  approver2Id: uuid("approver2_id")
    .references(() => users.id)
    .notNull(),
  driverId: uuid("driver_id")
    .references(() => drivers.id)
    .notNull(),
  vehicleId: uuid("vehicle_id")
    .references(() => vehicles.id)
    .notNull(),
  destinationId: uuid("destination_id")
    .references(() => destinations.id)
    .notNull(),
  distance: integer("distance").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  status: APPROVED("approve_status").notNull(),
  notes: text("notes").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const history = pgTable("history", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),

  requesterId: uuid("requester_id").notNull(),
  requesterName: varchar("requester_name", { length: 255 }).notNull(),
  approver1Id: uuid("approver1_id").notNull(),
  approver1Name: varchar("approver1_name", { length: 255 }).notNull(),
  approver2Id: uuid("approver2_id").notNull(),
  approver2Name: varchar("approver2_name", { length: 255 }).notNull(),

  driverId: uuid("driver_id").notNull(),
  driverName: varchar("driver_name", { length: 255 }).notNull(),

  vehicleId: uuid("vehicle_id").notNull(),
  vehicleRegNumber: varchar("vehicle_reg_number", { length: 255 }).notNull(),
  vehicleModel: varchar("vehicle_model", { length: 255 }).notNull(),

  destinationId: uuid("destination_id").notNull(),
  destinationName: varchar("destination_name", { length: 255 }).notNull(),
  destinationDistance: integer("destination_distance").notNull(),

  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),

  notes: text("notes").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
