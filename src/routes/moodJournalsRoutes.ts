import { Router } from 'express';
import { 
  createMoodJournal, 
  getAllMoodJournals,
  getMyMoodJournals,
  updateMoodJournal, 
  deleteMoodJournal,
  getMonthlyMoodJournals
} from '../controllers/moodJournalsController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = Router();

router.post('/', authenticateToken, createMoodJournal);
router.get('/', authenticateToken, getAllMoodJournals);
router.get('/my-journals', authenticateToken, getMyMoodJournals);
router.put('/:id', authenticateToken, updateMoodJournal);
router.delete('/:id', authenticateToken, deleteMoodJournal);
router.get('/mood-monthly', authenticateToken, getMonthlyMoodJournals);

export default router;