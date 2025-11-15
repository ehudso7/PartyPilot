import { Router } from 'express';
import { TripController } from './controller';

const router = Router();
const controller = new TripController();

router.post('/plan', (req, res) => controller.plan(req, res));
router.post('/', (req, res) => controller.create(req, res));
router.get('/:tripId', (req, res) => controller.getById(req, res));
router.put('/:tripId', (req, res) => controller.update(req, res));
router.delete('/:tripId', (req, res) => controller.delete(req, res));

export { router as tripRoutes };
