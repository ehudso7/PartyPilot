import { Router } from 'express';
import { EventController } from './controller';

const router = Router();
const controller = new EventController();

router.post('/', controller.create);
router.get('/trip/:tripId', controller.getByTripId);
router.get('/:id', controller.getById);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
