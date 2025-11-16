import { Router } from 'express';
import * as usersController from '../modules/users/controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

// GDPR compliance endpoints
router.get('/export', requireAuth, usersController.exportData);
router.delete('/account', requireAuth, usersController.deleteAccount);

export default router;
