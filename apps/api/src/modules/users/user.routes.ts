import { Router } from 'express';
import { createUser, deleteUser, getUserById, listUsers, updateUser } from './user.controller';

const router = Router();

router.get('/', listUsers);
router.post('/', createUser);
router.get('/:userId', getUserById);
router.put('/:userId', updateUser);
router.delete('/:userId', deleteUser);

export default router;
