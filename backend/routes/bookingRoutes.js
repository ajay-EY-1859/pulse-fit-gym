import { Router } from 'express';
import { createBooking, getBookings } from '../controllers/bookingController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', requireAuth, createBooking);
router.get('/', requireAuth, getBookings);

export default router;
