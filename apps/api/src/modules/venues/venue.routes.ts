import { Router } from 'express';
import { VenueController } from './venue.controller';

const router = Router();

router.get('/', VenueController.list);
router.post('/', VenueController.create);
router.get('/:venueId', VenueController.getById);
router.put('/:venueId', VenueController.update);
router.delete('/:venueId', VenueController.delete);

export default router;
