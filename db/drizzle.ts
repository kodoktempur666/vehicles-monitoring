import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Check if the DATABASE_URL environment variable exists
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not defined');
}

// Create a database connection
const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql);