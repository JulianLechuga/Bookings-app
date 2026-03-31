import { Router } from 'express';
import { getPublicBusiness, bookPublic, getMyReservations, getPublicBusinessesList, getAvailability, cancelAppt } from '../controllers/reservationController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.get('/public/businesses', getPublicBusinessesList);
router.get('/public/:alias', getPublicBusiness);
router.get('/public/:alias/availability', getAvailability);
router.post('/public/:alias/book', bookPublic);

// Private route for owners
router.get('/', authenticate, getMyReservations);
router.put('/:id/cancel', authenticate, cancelAppt);

export default router;
