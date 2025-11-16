import { asyncHandler } from '../../lib/asyncHandler';
import { validate } from '../../lib/validate';
import { type CreateUserInput,createUserSchema } from './users.schema';
import { userService } from './users.service';

export const createUserHandler = asyncHandler(async (req, res) => {
  const payload = validate<CreateUserInput>(createUserSchema, req.body);
  const user = await userService.findOrCreateByEmail(payload);
  res.status(201).json({ user });
});
