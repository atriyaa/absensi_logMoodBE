import express from 'express';
import { sql } from 'drizzle-orm';
import { db } from './db/index.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', async (_req, res) => {
  try {
    await db.execute(sql`SELECT 1`);
    return res.json({ status: 'ok' });
  } catch {
    return res.status(500).json({ status: 'error' });
  }
});



app.listen(3000, () => {
  console.log('Server berjalan di http://localhost:3000');
});