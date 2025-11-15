import { Router } from 'express';
import eventRoutes from '../modules/events/event.routes';
import plannerRoutes from '../modules/planner/planner.routes';
import tripRoutes from '../modules/trips/trip.routes';
import userRoutes from '../modules/users/user.routes';
import venueRoutes from '../modules/venues/venue.routes';

const router = Router();

router.use('/api/users', userRoutes);
router.use('/api/trips', plannerRoutes);
router.use('/api/trips', tripRoutes);
router.use('/api/events', eventRoutes);
router.use('/api/venues', venueRoutes);

export default router;
