import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { UserService } from './user.service';
import { createUserSchema, updateUserSchema, userIdParamSchema } from './user.types';

export class UserController {
  static list = asyncHandler(async (_req: Request, res: Response) => {
    const users = await UserService.listUsers();
    res.json({ users });
  });

  static create = asyncHandler(async (req: Request, res: Response) => {
    const { body } = createUserSchema.parse({ body: req.body });
    const user = await UserService.createUser(body);
    res.status(201).json({ user });
  });

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const { params } = userIdParamSchema.parse({ params: req.params });
    const user = await UserService.getUserById(params.userId);
    res.json({ user });
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const { params, body } = updateUserSchema.parse({ params: req.params, body: req.body });
    const user = await UserService.updateUser(params.userId, body);
    res.json({ user });
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    const { params } = userIdParamSchema.parse({ params: req.params });
    await UserService.deleteUser(params.userId);
    res.status(204).send();
  });
}
