import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import {
  requestTrainerRole,
  getMyApplicationStatus,
  getAllApplications,
  approveApplication,
  rejectApplication,
} from '../controllers/applicationController.js';

const router = express.Router();

// Member: Request trainer role
router.post('/request', requireAuth, requestTrainerRole);

// Get own application status
router.get('/my-status', requireAuth, getMyApplicationStatus);

// Admin only: Get all applications
router.get('/', requireAuth, requireRole(['admin']), getAllApplications);

// Admin only: Approve application
router.patch('/:applicationId/approve', requireAuth, requireRole(['admin']), approveApplication);

// Admin only: Reject application
router.patch('/:applicationId/reject', requireAuth, requireRole(['admin']), rejectApplication);

export default router;
