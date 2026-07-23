import { Router } from 'express';
import multer from 'multer';
import * as employeesController from '../controllers/employeesController.js';
import { authenticateToken  } from '../middlewares/auth.js';

const router: Router = Router();
const upload = multer();

router.get('/', employeesController.getAll);
router.get('/:id', authenticateToken, employeesController.getById);
router.post('/', authenticateToken, upload.none(), employeesController.createEmployee);
router.put('/:id', authenticateToken, upload.none(), employeesController.updateEmployee);
router.delete('/:id', authenticateToken, employeesController.removeEmployee);

export default router;