ALTER TABLE "bookings" RENAME COLUMN "approver_id" TO "approver1_id";--> statement-breakpoint
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_approver_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "approver2_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "history" ADD COLUMN "approver1_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "history" ADD COLUMN "approver1_name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "history" ADD COLUMN "approver2_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "history" ADD COLUMN "approver2_name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_approver1_id_users_id_fk" FOREIGN KEY ("approver1_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_approver2_id_users_id_fk" FOREIGN KEY ("approver2_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;