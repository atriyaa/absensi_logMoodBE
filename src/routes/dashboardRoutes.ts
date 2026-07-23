import { Router } from "express";
import { getAdminDashboard } from "../controllers/dashboardController.js";

const router = Router();

router.get('/dashboard', getAdminDashboard);

export default router;