import { Router } from 'express';
import { 
  checkIn, 
  checkOut, 
  getMyAttendance 
} from '../controllers/attedanceLogsController.js'; 
import { authenticateToken } from '../middlewares/auth.js'; 

const upload: Router = Router();
const router = Router();

// router.use(authenticateToken);
router.post('/check-in', checkIn);
router.put('/check-out', checkOut); 
router.get('/my-history', getMyAttendance);

export default router;