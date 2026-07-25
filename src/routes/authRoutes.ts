import { Router } from 'express';
import { register, login, updateProfile, changePassword } from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.put('/update-profile', authenticateToken, updateProfile);
router.put('/change-password', authenticateToken, changePassword);

export default router;