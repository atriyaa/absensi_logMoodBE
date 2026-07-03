import { Router } from 'express';
import multer from 'multer';
import * as departmentsController from '../controllers/departmentsController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router: Router = Router();
const upload = multer();

router.get('/', departmentsController.getAllDepartments);
router.get('/:id', departmentsController.getDepartmentsById);

router.post('/', authenticateToken, upload.none(), departmentsController.createDepartments);
router.put('/', authenticateToken, upload.none(), departmentsController.updateDepartments);
router.delete('/', authenticateToken, upload.none(), departmentsController.removeDepartments);

export default router;