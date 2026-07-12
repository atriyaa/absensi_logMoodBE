import { Router } from 'express';
import multer from 'multer';
import * as employeesController from '../controllers/employeesController.js';
import { authenticateToken  } from '../middlewares/auth.js';

const router: Router = Router();
const upload = multer();

router.get('/', authenticateToken, upload.none(),employeesController.getAll);
router.get('/', authenticateToken, upload.none(),employeesController.getById);
router.get('/', authenticateToken, upload.none(),employeesController.createEmployee);
router.get('/', authenticateToken, upload.none(),employeesController.updateEmployee);
router.get('/', authenticateToken, upload.none(), employeesController.removeEmployee);

export default router;