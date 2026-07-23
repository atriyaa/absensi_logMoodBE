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

// Employee routes
// router.use(authenticateToken);
router.post('/check-in', checkIn);
router.put('/check-out', checkOut); 
router.get('/my-history', getMyAttendance);

export default router;