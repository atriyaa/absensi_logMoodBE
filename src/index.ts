import express from 'express';
import { sql } from 'drizzle-orm';
import { db } from './db/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import employeesRoutes from './routes/employeesRoutes.js';
import departmentsRoutes from './routes/departmentsRoutes.js';
import authRoutes from './routes/authRoutes.js';
import rolesRoutes from './routes/rolesRoutes.js';
import attendanceLogsRoutes  from './routes/attedanceLogsRoutes.js';
import dashboardRoutes from "./routes/dashboardRoutes.js";
import moodJournalsRoutes from './routes/moodJournalsRoutes.js';
import workSchedulesRoutes from './routes/workSchedulesRoutes.js';
import cors from 'cors';

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(cors());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Auto migration to ensure photo_in column exists in attendance_logs MySQL table
(async () => {
  try {
    await db.execute(sql`ALTER TABLE attendance_logs ADD COLUMN photo_in LONGTEXT`);
    console.log('Kolom photo_in berhasil ditambahkan ke tabel attendance_logs');
  } catch {
    // Abaikan jika kolom photo_in sudah ada di MySQL
  }
})();

app.get('/health', async (_req, res) => {
  try {
    await db.execute(sql`SELECT 1`);
    return res.json({ status: 'ok' });
  } catch (err){
    return res.status(500).json({ status: err});
  }
});

app.use('/auth', authRoutes);
app.use('/admin',dashboardRoutes)
app.use('/departments', departmentsRoutes);
app.use('/employees', employeesRoutes);
app.use('/roles', rolesRoutes);
app.use('/attedanceLogs', attendanceLogsRoutes);
app.use('/moodJournals', moodJournalsRoutes);
app.use('/workSchedules', workSchedulesRoutes);
app.use(errorHandler);

app.listen(3000, () => {
  console.log('Server berjalan di http://localhost:3000');
});