import { Router } from 'express';
import { createMembership, getMemberships } from '../controllers/membershipController.js';

const router = Router();

router.post('/', createMembership);
router.get('/', getMemberships);

export default router;
