CREATE TYPE "public"."approve_status" AS ENUM('approved_lv1', 'approved_lv2', 'not_approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('admin', 'approver_l1', 'approver_l2');--> statement-breakpoint
CREATE TYPE "public"."status_driver" AS ENUM('available', 'on_duty', 'on_leave');--> statement-breakpoint
CREATE TYPE "public"."status_vehicle" AS ENUM('available', 'maintenance', 'in_use');--> statement-breakpoint
CREATE TYPE "public"."type_vehicle" AS ENUM('passenger', 'cargo');--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"requester_id" uuid NOT NULL,
	"approver_id" uuid NOT NULL,
	"driver_id" uuid NOT NULL,
	"vehicle_id" uuid NOT NULL,
	"destination_id" uuid NOT NULL,
	"distance" integer NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"approve_status" "approve_status" NOT NULL,
	"notes" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "bookings_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "destinations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	CONSTRAINT "destinations_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "drivers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"license_number" varchar(255) NOT NULL,
	"phone_number" varchar(255) NOT NULL,
	"status_driver" "status_driver" NOT NULL,
	CONSTRAINT "drivers_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"requester_id" uuid NOT NULL,
	"requester_name" varchar(255) NOT NULL,
	"driver_id" uuid NOT NULL,
	"driver_name" varchar(255) NOT NULL,
	"vehicle_id" uuid NOT NULL,
	"vehicle_reg_number" varchar(255) NOT NULL,
	"vehicle_model" varchar(255) NOT NULL,
	"destination_id" uuid NOT NULL,
	"destination_name" varchar(255) NOT NULL,
	"destination_distance" integer NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"notes" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "history_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "maintenance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vehicle_id" uuid NOT NULL,
	"scheduled_date" date NOT NULL,
	"status" boolean NOT NULL,
	"notes" text NOT NULL,
	CONSTRAINT "maintenance_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(50) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" "role" NOT NULL,
	CONSTRAINT "users_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "vehicles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"registration_number" varchar(255) NOT NULL,
	"fuel_consumption" integer NOT NULL,
	"model" varchar(255) NOT NULL,
	"type_vehicle" "type_vehicle" NOT NULL,
	"status_vehicle" "status_vehicle" NOT NULL,
	CONSTRAINT "vehicles_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_requester_id_users_id_fk" FOREIGN KEY ("requester_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_approver_id_users_id_fk" FOREIGN KEY ("approver_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_driver_id_drivers_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."drivers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_destination_id_destinations_id_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."destinations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenance" ADD CONSTRAINT "maintenance_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE no action ON UPDATE no action;