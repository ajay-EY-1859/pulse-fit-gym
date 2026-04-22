import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import {
  getAllUsers,
  changeUserRole,
  deleteUser,
  getAllSubscriptions,
  getAnalytics,
  createMembershipPlan,
  updateMembershipPlan,
  deleteMembershipPlan,
} from '../controllers/adminController.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(requireAuth, requireRole(['admin']));

// User management
router.get('/users', getAllUsers);
router.patch('/users/:userId/role', changeUserRole);
router.delete('/users/:userId', deleteUser);

// Subscription management
router.get('/subscriptions', getAllSubscriptions);

// Analytics
router.get('/analytics', getAnalytics);

// Membership plan management
router.post('/membership-plans', createMembershipPlan);
router.patch('/membership-plans/:planId', updateMembershipPlan);
router.delete('/membership-plans/:planId', deleteMembershipPlan);

export default router;
