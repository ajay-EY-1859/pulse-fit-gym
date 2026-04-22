import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import {
  getMySubscription,
  purchaseSubscription,
  cancelSubscription,
  renewSubscription,
} from '../controllers/subscriptionController.js';

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

router.get('/my-subscription', getMySubscription);
router.post('/purchase', purchaseSubscription);
router.post('/cancel', cancelSubscription);
router.post('/renew', renewSubscription);

export default router;
