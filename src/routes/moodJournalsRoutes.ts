import { Router } from 'express';
import { 
  createMoodJournal, 
  getAllMoodJournals, 
  updateMoodJournal, 
  deleteMoodJournal 
} from '../controllers/moodJournalsController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = Router();

router.use(authenticateToken);
router.post('/', createMoodJournal);
router.get('/', getAllMoodJournals);
router.put('/:id', updateMoodJournal);
router.delete('/:id', deleteMoodJournal);

export default router;