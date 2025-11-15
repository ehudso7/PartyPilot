import { Router } from 'express';
import { TripController } from './trip.controller';
import { PlannerController } from '../planner/planner.controller';

const router = Router();

router.get('/', TripController.list);
router.post('/', TripController.create);
router.post('/plan', PlannerController.planTrip);
router.get('/:tripId', TripController.getDetails);
router.put('/:tripId', TripController.update);
router.delete('/:tripId', TripController.delete);

export default router;
