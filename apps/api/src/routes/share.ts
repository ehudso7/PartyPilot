import { Router } from 'express';
import * as shareController from '../modules/trips/shareController';

const router = Router();

router.get('/:slug', shareController.getPublicItinerary);

export default router;
