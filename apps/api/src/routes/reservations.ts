import { Router } from 'express';
import * as reservationsController from '../modules/reservations/controller';

const router = Router();

router.post('/prepare', reservationsController.prepareReservations);
router.post('/book', reservationsController.bookReservation);
router.get('/:reservationId', reservationsController.getReservation);

export default router;
