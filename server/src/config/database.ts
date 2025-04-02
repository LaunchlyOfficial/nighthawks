import pg from 'pg';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Update the path to look for .env in the server directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const pool = new pg.Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'nighthawk',
  password: process.env.DB_PASSWORD || '774616',
  port: parseInt(process.env.DB_PORT || '5432'),
});

// Test the connection
pool.on('connect', () => {
  console.log('Connected to database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Export both the query function and the db object for compatibility
export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
};

export const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
};

export default pool; 