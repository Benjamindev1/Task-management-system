import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn('DATABASE_URL is not set. Configure it in backend/.env before starting the API.');
}

const isNeonConnection = databaseUrl?.includes('neon.tech');

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: isNeonConnection ? { rejectUnauthorized: false } : false,
  max: 10,
});

export default pool;
