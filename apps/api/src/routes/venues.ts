import { Router } from 'express';
import { venueController } from '../modules/venues/controller';

const router = Router();

router.post('/', venueController.create.bind(venueController));
router.get('/', venueController.list.bind(venueController));
router.get('/search', venueController.search.bind(venueController));
router.get('/:id', venueController.getById.bind(venueController));
router.put('/:id', venueController.update.bind(venueController));
router.delete('/:id', venueController.delete.bind(venueController));

export default router;
