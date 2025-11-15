import { Router } from 'express';
import userRoutes from '../modules/users/user.routes';
import tripRoutes from '../modules/trips/trip.routes';
import eventRoutes from '../modules/events/event.routes';
import venueRoutes from '../modules/venues/venue.routes';

const router = Router();

router.use('/users', userRoutes);
router.use('/trips', tripRoutes);
router.use('/events', eventRoutes);
router.use('/venues', venueRoutes);

export default router;
