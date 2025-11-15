import { Router } from 'express';
import usersRoutes from '../modules/users/routes';
import tripsRoutes from '../modules/trips/routes';
import eventsRoutes from '../modules/events/routes';
import venuesRoutes from '../modules/venues/routes';

const router = Router();

router.use('/users', usersRoutes);
router.use('/trips', tripsRoutes);
router.use('/events', eventsRoutes);
router.use('/venues', venuesRoutes);

export default router;
