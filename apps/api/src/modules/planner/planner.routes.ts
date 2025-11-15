import { Router } from 'express';
import { planTrip } from './planner.controller';

const router = Router();

router.post('/plan', planTrip);

export default router;
