import pkg from 'pg';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
const { Pool } = pkg;
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Update the path to look for .env in the server directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Add console.log to debug the environment variables
console.log('Database Config:', {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432"),
  ssl: process.env.NODE_ENV === "production" 
    ? { rejectUnauthorized: false }
    : undefined
});

export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

export const getClient = () => pool.connect(); 