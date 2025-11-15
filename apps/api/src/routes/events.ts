import { Router } from 'express';
import { eventController } from '../modules/events/controller';

const router = Router();

router.post('/', eventController.create.bind(eventController));
router.get('/:id', eventController.getById.bind(eventController));
router.put('/:id', eventController.update.bind(eventController));
router.delete('/:id', eventController.delete.bind(eventController));

export default router;
