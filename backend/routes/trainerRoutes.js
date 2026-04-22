import { Router } from 'express';
import { getTrainers, getMyClasses, getMyMembers, getPersonalTrainingAssignments, assignPersonalTraining, endPersonalTraining } from '../controllers/trainerController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = Router();

router.get('/', getTrainers);

router.use(requireAuth, requireRole(['trainer', 'admin']));
router.get('/my-classes', getMyClasses);
router.get('/my-members', getMyMembers);
router.get('/personal-training', getPersonalTrainingAssignments);
router.post('/personal-training/:memberId', assignPersonalTraining);
router.patch('/personal-training/:assignmentId/end', endPersonalTraining);

export default router;
