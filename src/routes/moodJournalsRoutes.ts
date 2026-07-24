import { Router } from 'express';
import { 
  createMoodJournal, 
  getAllMoodJournals,
  getMyMoodJournals,
  updateMoodJournal, 
  deleteMoodJournal 
} from '../controllers/moodJournalsController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = Router();

router.post('/', authenticateToken, createMoodJournal);
router.get('/', authenticateToken, getAllMoodJournals);
router.get('/my-journals', authenticateToken, getMyMoodJournals);
router.put('/:id', authenticateToken, updateMoodJournal);
router.delete('/:id', authenticateToken, deleteMoodJournal);

export default router;