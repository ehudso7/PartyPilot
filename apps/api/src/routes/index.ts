import { Router } from 'express';
import usersRouter from './users';
import venuesRouter from './venues';
import eventsRouter from './events';
import tripsRouter from './trips';

const router = Router();

// Mount module routes
router.use('/users', usersRouter);
router.use('/venues', venuesRouter);
router.use('/events', eventsRouter);
router.use('/trips', tripsRouter);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
