import { Router } from 'express';
import { update } from '../controllers/profileController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();
router.put('/', authenticate, update);

export default router;
