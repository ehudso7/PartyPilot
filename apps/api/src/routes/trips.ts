import { Router } from 'express';
import * as tripsController from '../modules/trips/controller';

const router = Router();

router.post('/plan', tripsController.planTrip);
router.get('/:tripId', tripsController.getTrip);
router.put('/:tripId', tripsController.updateTrip);
router.get('/:tripId/events', tripsController.getTripEvents);
router.get('/:tripId/export/ics', tripsController.exportIcs);
router.get('/:tripId/export/pdf', tripsController.exportPdf);
router.get('/:tripId/share-link', tripsController.getShareLink);
router.post('/:tripId/notifications/bootstrap', tripsController.bootstrapNotifications);

export default router;
