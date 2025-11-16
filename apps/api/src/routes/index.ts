import { Router } from 'express';

import { tripRouter } from '../modules/trips/trips.routes';
import { userRouter } from '../modules/users/users.routes';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

router.use('/users', userRouter);
router.use('/trips', tripRouter);

export { router };
