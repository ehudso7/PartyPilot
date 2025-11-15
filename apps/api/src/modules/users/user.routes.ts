import { Router } from 'express';
import { UserController } from './user.controller';

const router = Router();

router.get('/', UserController.list);
router.post('/', UserController.create);
router.get('/:userId', UserController.getById);
router.put('/:userId', UserController.update);
router.delete('/:userId', UserController.delete);

export default router;
