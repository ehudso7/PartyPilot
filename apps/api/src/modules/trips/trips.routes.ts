import { Router } from 'express';

import { getTripHandler, planTripHandler } from './trips.controller';

const router = Router();

router.post('/plan', planTripHandler);
router.get('/:tripId', getTripHandler);

export { router as tripRouter };
