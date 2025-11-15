import { Router } from 'express';
import { createEvent, deleteEvent, getEventById, listEvents, updateEvent } from './event.controller';

const router = Router();

router.get('/', listEvents);
router.post('/', createEvent);
router.get('/:eventId', getEventById);
router.put('/:eventId', updateEvent);
router.delete('/:eventId', deleteEvent);

export default router;
