import { Router } from 'express';
import { EventController } from './event.controller';

const router = Router();

router.get('/', EventController.listByTrip);
router.post('/', EventController.create);
router.get('/:eventId', EventController.getById);
router.put('/:eventId', EventController.update);
router.delete('/:eventId', EventController.delete);

export default router;
