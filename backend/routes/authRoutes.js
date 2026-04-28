import { Router } from 'express';
import { login, register, verifyToken } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify', requireAuth, verifyToken);

export default router;
