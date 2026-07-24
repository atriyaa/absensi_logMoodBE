import { Router } from 'express';
import { 
  checkIn, 
  checkOut, 
  getMyAttendance,
  getAllAttendanceLogs,
  getMonthlyAttendanceLogs,
  getDepartmentMonthlyReport
} from '../controllers/attedanceLogsController.js'; 
import { authenticateToken } from '../middlewares/auth.js'; 

const router = Router();

// Admin route (all attendance logs)
router.get('/', getAllAttendanceLogs);
router.post('/check-in', authenticateToken, checkIn);
router.put('/check-out', authenticateToken, checkOut); 
router.get('/my-history', authenticateToken, getMyAttendance);
router.get('/report-monthly', authenticateToken, getMonthlyAttendanceLogs);
router.get('/report-monthly-departments', authenticateToken, getDepartmentMonthlyReport);

export default router;