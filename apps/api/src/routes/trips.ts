import { Router } from 'express';
import { tripController } from '../modules/trips/controller';

const router = Router();

// Plan trip from prompt (main entry point)
router.post('/plan', tripController.plan.bind(tripController));

// Standard CRUD
router.post('/', tripController.create.bind(tripController));
router.get('/', tripController.list.bind(tripController));
router.get('/:id', tripController.getById.bind(tripController));
router.get('/:id/events', tripController.getEvents.bind(tripController));
router.put('/:id', tripController.update.bind(tripController));
router.delete('/:id', tripController.delete.bind(tripController));

export default router;
