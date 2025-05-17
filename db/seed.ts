import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import config from '@/lib/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import {
  users,
  ROLE_ENUM,
  destinations,
  vehicles,
  TYPE_VEHICLE,
  STATUS_VEHICLE,
  drivers,
  STATUS_DRIVER,
  maintenance,
  bookings,
  APPROVED,
} from "./schema";

// const sql = neon(config.env.databaseUrl);

const DATABASE_URL = "postgresql://neondb_owner:npg_bcCG4wYv1qIe@ep-empty-surf-a44l22i0-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"
const sql = neon(DATABASE_URL)

export const db = drizzle({client: sql});

async function seed() {
  // --- Users ---
  const userData = [
    {
      name: "Admin User",
      email: "admin@gmail.com",
      password: "admin123",
      role: "admin",
    },
    {
      name: "Approver Level 1",
      email: "approver1@gmail.com",
      password: "approver1pass",
      role: "approver_l1",
    },
    {
      name: "Approver Level 2",
      email: "approver2@gmail.com",
      password: "approver2pass",
      role: "approver_l2",
    },
  ];

  // Hash password before insert
  const hashedUsers = await Promise.all(
    userData.map(async (u) => ({
      ...u,
      password: await hash(u.password, 10),
    }))
  );

  for (const user of hashedUsers) {
    // Insert user jika belum ada
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, user.email));
    if (existing.length === 0) {
      await db.insert(users).values(user);
    }
  }

  // --- Destinations ---
  const destinationsData = [
    {
      name: "Kantor Pusat",
      type: "Office",
    },
    {
      name: "Kantor Cabang Sulawesi Tenggara",
      type: "Branch Office",
    },
    {
      name: "Tambang Nikel Pomalaa",
      type: "Mine",
    },
    {
      name: "Tambang Nikel Morowali",
      type: "Mine",
    },
    {
      name: "Tambang Nikel Bahodopi",
      type: "Mine",
    },
    {
      name: "Tambang Nikel Kolaka",
      type: "Mine",
    },
    {
      name: "Tambang Nikel Wawonii",
      type: "Mine",
    },
    {
      name: "Tambang Nikel Konawe",
      type: "Mine",
    },
  ];
  for (const dest of destinationsData) {
    await db.insert(destinations).values(dest).onConflictDoNothing();
  }

  // --- Vehicles ---
  const vehiclesData = [
    {
      regNumber: "B 1234 CD",
      fuelConsumption: 10,
      model: "Toyota Avanza",
      type: "passenger",
      status: "available",
    },
    {
      regNumber: "D 5678 EF",
      fuelConsumption: 15,
      model: "Isuzu Elf",
      type: "cargo",
      status: "maintenance",
    },
  ];
  for (const v of vehiclesData) {
    await db.insert(vehicles).values(v).onConflictDoNothing();
  }

  // --- Drivers ---
  const driversData = [
    {
      name: "Joko",
      licenseNumber: "S1234567",
      phoneNumber: "081234567890",
      status: "available",
    },
    {
      name: "Budi Santoso",
      licenseNumber: "S7654321",
      phoneNumber: "089876543210",
      status: "on_duty",
    },
  ];
  for (const d of driversData) {
    await db.insert(drivers).values(d).onConflictDoNothing();
  }

  // Optional: insert maintenance, bookings, history similarly...

  console.log("Seeding done");
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
