import express from 'express';
import { sql } from 'drizzle-orm';
import { db } from './db/index.js';
import employeesRoutes from './routes/employeesRoutes.js';
import departmentsRoutes from './routes/departmentsRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import authRoutes from './routes/authRoutes.js';


const app = express();
app.use(express.json());
// app.use(cors());
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
app.use('/departments', departmentsRoutes);
app.use('/employees', employeesRoutes);



app.use(errorHandler);

app.listen(3000, () => {
  console.log('Server berjalan di http://localhost:3000');
});