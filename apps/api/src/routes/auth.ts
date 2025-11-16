import { Router } from 'express';
import * as authController from '../modules/auth/controller';
import { validate } from '../middleware/validate';
import { RegisterSchema, LoginSchema } from '../modules/auth/schemas';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/register', validate(RegisterSchema), authController.register);
router.post('/login', validate(LoginSchema), authController.login);
router.get('/me', requireAuth, authController.getMe);

export default router;
