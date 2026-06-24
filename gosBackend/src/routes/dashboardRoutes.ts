import { Router } from 'express';
import * as dashboardController from '../controllers/dashboardController';
import { authenticate } from '../middleware/authMiddleware';
import { authorize } from '../middleware/roleMiddleware';

const router = Router();

router.get('/admin/dashboard', authenticate, authorize(['Admin']), dashboardController.adminDashboard);
router.get('/manager/dashboard', authenticate, authorize(['Manager']), dashboardController.managerDashboard);
router.get('/employee/dashboard', authenticate, authorize(['Employee']), dashboardController.employeeDashboard);
router.get('/user/dashboard', authenticate, authorize(['User','Employee','Manager','Admin']), dashboardController.userDashboard);

export default router;
