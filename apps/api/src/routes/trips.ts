import { Router } from 'express';
import * as tripsController from '../modules/trips/controller';
import { requireAuth } from '../middleware/auth';
import { validate, validateParams } from '../middleware/validate';
import { PlanTripSchema, UpdateTripSchema, TripIdSchema } from '../modules/trips/schemas';

const router = Router();

// All routes require authentication
router.post('/plan', requireAuth, validate(PlanTripSchema), tripsController.planTrip);
router.get('/:tripId', requireAuth, validateParams(TripIdSchema), tripsController.getTrip);
router.put('/:tripId', requireAuth, validateParams(TripIdSchema), validate(UpdateTripSchema), tripsController.updateTrip);
router.get('/:tripId/events', requireAuth, validateParams(TripIdSchema), tripsController.getTripEvents);
router.get('/:tripId/export/ics', requireAuth, validateParams(TripIdSchema), tripsController.exportIcs);
router.get('/:tripId/export/pdf', requireAuth, validateParams(TripIdSchema), tripsController.exportPdf);
router.get('/:tripId/share-link', requireAuth, validateParams(TripIdSchema), tripsController.getShareLink);
router.post('/:tripId/notifications/bootstrap', requireAuth, validateParams(TripIdSchema), tripsController.bootstrapNotifications);

export default router;
