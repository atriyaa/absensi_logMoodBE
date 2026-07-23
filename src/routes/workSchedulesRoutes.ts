import { Router } from 'express';
import {
  createWorkSchedule,
  getAllWorkSchedules,
  getWorkScheduleById,
  updateWorkSchedule,
  deleteWorkSchedule,
} from '../controllers/workSchedulesController.js';
import { authenticateToken} from '../middlewares/auth.js';

const router = Router();

router.use(authenticateToken);

// Get All & Get By ID
router.get('/', getAllWorkSchedules);
router.get('/:id', getWorkScheduleById);

// Admin Only Routes
router.post('/', createWorkSchedule);
router.put('/:id', updateWorkSchedule);
router.delete('/:id', deleteWorkSchedule);

export default router;