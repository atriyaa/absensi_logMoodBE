import { Router } from 'express';
import multer from 'multer';
import * as rolesController from '../controllers/rolesController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router: Router = Router();
const upload = multer();

router.get('/', rolesController.getAllRoles);
router.get('/:id', rolesController.getRolesById);

router.post('/', authenticateToken, upload.none(), rolesController.createRoles);
router.put('/', authenticateToken, upload.none(), rolesController.updateRoles);
router.delete('/', authenticateToken, upload.none(), rolesController.removeRoles);

export default router;
