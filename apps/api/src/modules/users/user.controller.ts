import { asyncHandler } from '../../utils/asyncHandler';
import { createUserSchema, updateUserSchema, userIdParamSchema } from './user.schema';
import * as userService from './user.service';

export const listUsers = asyncHandler(async (_req, res) => {
  const users = await userService.listUsers();
  res.json({ users });
});

export const createUser = asyncHandler(async (req, res) => {
  const payload = createUserSchema.parse(req.body);
  const user = await userService.createUser(payload);
  res.status(201).json({ user });
});

export const getUserById = asyncHandler(async (req, res) => {
  const { userId } = userIdParamSchema.parse(req.params);
  const user = await userService.getUserById(userId);
  res.json({ user });
});

export const updateUser = asyncHandler(async (req, res) => {
  const { userId } = userIdParamSchema.parse(req.params);
  const payload = updateUserSchema.parse(req.body);
  const user = await userService.updateUser(userId, payload);
  res.json({ user });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = userIdParamSchema.parse(req.params);
  await userService.deleteUser(userId);
  res.status(204).send();
});
