ALTER TABLE "bookings" ALTER COLUMN "approve_status" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."approve_status";--> statement-breakpoint
CREATE TYPE "public"."approve_status" AS ENUM('pending', 'approved_lv1', 'approved', 'rejected');--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "approve_status" SET DATA TYPE "public"."approve_status" USING "approve_status"::"public"."approve_status";