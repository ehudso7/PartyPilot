import { Router } from 'express';
import { createVenue, deleteVenue, getVenueById, listVenues, updateVenue } from './venue.controller';

const router = Router();

router.get('/', listVenues);
router.post('/', createVenue);
router.get('/:venueId', getVenueById);
router.put('/:venueId', updateVenue);
router.delete('/:venueId', deleteVenue);

export default router;
