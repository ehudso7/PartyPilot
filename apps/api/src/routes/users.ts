import { Router } from 'express';
import { userController } from '../modules/users/controller';

const router = Router();

router.post('/', userController.create.bind(userController));
router.get('/', userController.list.bind(userController));
router.get('/:id', userController.getById.bind(userController));
router.put('/:id', userController.update.bind(userController));
router.delete('/:id', userController.delete.bind(userController));

export default router;
