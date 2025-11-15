import { Request, Response } from 'express';
import { UserService } from './service';
import { CreateUserInput, UpdateUserInput } from './types';

export class UserController {
  private service: UserService;

  constructor() {
    this.service = new UserService();
  }

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const data: CreateUserInput = req.body;
      const user = await this.service.createUser(data);
      res.status(201).json(user);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create user';
      res.status(400).json({ error: message });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await this.service.getUserById(id);
      res.json(user);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'User not found';
      res.status(404).json({ error: message });
    }
  };

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.service.getAllUsers();
      res.json(users);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch users';
      res.status(500).json({ error: message });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const data: UpdateUserInput = req.body;
      const user = await this.service.updateUser(id, data);
      res.json(user);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update user';
      const status = message === 'User not found' ? 404 : 400;
      res.status(status).json({ error: message });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.service.deleteUser(id);
      res.status(204).send();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete user';
      const status = message === 'User not found' ? 404 : 500;
      res.status(status).json({ error: message });
    }
  };
}
