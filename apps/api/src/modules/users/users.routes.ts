import { Router } from 'express';

import { createUserHandler } from './users.controller';

const router = Router();

router.post('/', createUserHandler);

export { router as userRouter };
