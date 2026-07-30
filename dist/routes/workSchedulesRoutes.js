import { Router } from 'express';
import { createWorkSchedule, getAllWorkSchedules, getWorkScheduleById, updateWorkSchedule, deleteWorkSchedule, } from '../controllers/workSchedulesController.js';
import { authenticateToken } from '../middlewares/auth.js';
const router = Router();
// Get All & Get By ID (harus login)
router.get('/', authenticateToken, getAllWorkSchedules);
router.get('/:id', authenticateToken, getWorkScheduleById);
// Admin Only Routes
router.post('/', authenticateToken, createWorkSchedule);
router.put('/:id', authenticateToken, updateWorkSchedule);
router.delete('/:id', authenticateToken, deleteWorkSchedule);
export default router;
//# sourceMappingURL=workSchedulesRoutes.js.map