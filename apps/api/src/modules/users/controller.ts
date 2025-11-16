import { Response } from 'express';
import * as usersService from './service';
import { logger } from '../../config/logger';
import { AuthRequest } from '../../middleware/auth';

export async function exportData(req: AuthRequest, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const data = await usersService.exportUserData(req.userId);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="partypilot-data-${req.userId}.json"`);
    return res.send(JSON.stringify(data, null, 2));
  } catch (error) {
    logger.error('Data export error:', error);
    return res.status(500).json({ error: 'Failed to export data' });
  }
}

export async function deleteAccount(req: AuthRequest, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const result = await usersService.deleteUserAccount(req.userId);

    return res.json(result);
  } catch (error) {
    logger.error('Account deletion error:', error);
    return res.status(500).json({ error: 'Failed to delete account' });
  }
}
