import { Router } from 'express';
import { EventController } from './controller';

const router = Router();
const controller = new EventController();

router.post('/', (req, res) => controller.create(req, res));
router.get('/trip/:tripId', (req, res) => controller.getByTripId(req, res));
router.get('/:id', (req, res) => controller.getById(req, res));
router.put('/:id', (req, res) => controller.update(req, res));
router.delete('/:id', (req, res) => controller.delete(req, res));

export { router as eventRoutes };
