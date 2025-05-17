import config from '@/lib/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';


const DATABASE_URL = "postgresql://neondb_owner:npg_bcCG4wYv1qIe@ep-empty-surf-a44l22i0-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"
const sql = neon(DATABASE_URL);

export const db = drizzle({client: sql});
