import { Router } from 'express';
import { 
  checkIn, 
  checkOut, 
  getMyAttendance,
  getAllAttendanceLogs
} from '../controllers/attedanceLogsController.js'; 
import { authenticateToken } from '../middlewares/auth.js'; 

const router = Router();

// Admin route (all attendance logs)
router.get('/', getAllAttendanceLogs);

// Employee routes (require JWT authentication)
router.post('/check-in', authenticateToken, checkIn);
router.put('/check-out', authenticateToken, checkOut); 
router.get('/my-history', authenticateToken, getMyAttendance);

export default router;