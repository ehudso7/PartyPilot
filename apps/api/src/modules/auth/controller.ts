import { Request, Response } from 'express';
import * as authService from './service';
import { logger } from '../../config/logger';
import { AuthRequest } from '../../middleware/auth';

export async function register(req: Request, res: Response) {
  try {
    const { email, password, name, phone } = req.body;

    const result = await authService.registerUser(email, password, name, phone);

    return res.status(201).json(result);
  } catch (error) {
    if (error instanceof Error && error.message === 'Email already registered') {
      return res.status(409).json({ error: error.message });
    }
    logger.error('Registration error:', error);
    return res.status(500).json({ error: 'Registration failed' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const result = await authService.loginUser(email, password);

    return res.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid credentials') {
      return res.status(401).json({ error: error.message });
    }
    if (error instanceof Error && error.message === 'Account has been deleted') {
      return res.status(403).json({ error: error.message });
    }
    logger.error('Login error:', error);
    return res.status(500).json({ error: 'Login failed' });
  }
}

export async function getMe(req: AuthRequest, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await authService.getUserById(req.userId);

    return res.json({ user });
  } catch (error) {
    logger.error('Get user error:', error);
    return res.status(500).json({ error: 'Failed to fetch user' });
  }
}
