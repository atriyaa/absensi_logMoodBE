import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from './schema.js';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'absensi_logmood',
  connectionLimit: 10
});

export const db = drizzle(pool, { schema, mode: 'default' });