import express from 'express';
import { sql } from 'drizzle-orm';
import { db } from './db/index.js';
import employeesRoutes from './routes/employeesRoutes.js';
import departmentsRoutes from './routes/departmentsRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import rolesRoutes from './routes/rolesRoutes.js';
import attendanceLogsRoutes  from './routes/attedanceLogsRoutes.js';
import dashboardRoutes from "./routes/dashboardRoutes.js";
import moodJournalsRoutes from './routes/moodJournalsRoutes.js';
import workSchedulesRoutes from './routes/workSchedulesRoutes.js';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.get('/health', async (_req, res) => {
  try {
    await db.execute(sql`SELECT 1`);
    return res.json({ status: 'ok' });
  } catch {
    return res.status(500).json({ status: 'error' });
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