import { Router } from 'express';
import { TripController } from './controller';

const router = Router();
const controller = new TripController();

router.post('/', controller.create);
router.post('/plan', controller.plan);
router.get('/:tripId', controller.getById);
router.put('/:tripId', controller.update);

export default router;
