import { Router } from 'express';
import * as reservationsController from '../modules/reservations/controller';
import { requireAuth } from '../middleware/auth';
import { validate, validateParams } from '../middleware/validate';
import { PrepareReservationsSchema, BookReservationSchema, ReservationIdSchema } from '../modules/reservations/schemas';

const router = Router();

// All routes require authentication
router.post('/prepare', requireAuth, validate(PrepareReservationsSchema), reservationsController.prepareReservations);
router.post('/book', requireAuth, validate(BookReservationSchema), reservationsController.bookReservation);
router.get('/:reservationId', requireAuth, validateParams(ReservationIdSchema), reservationsController.getReservation);

export default router;
