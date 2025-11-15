import { Router } from 'express';
import { createTrip, deleteTrip, getTripDetails, listTrips, updateTrip } from './trip.controller';

const router = Router();

router.get('/', listTrips);
router.post('/', createTrip);
router.get('/:tripId', getTripDetails);
router.put('/:tripId', updateTrip);
router.delete('/:tripId', deleteTrip);

export default router;
