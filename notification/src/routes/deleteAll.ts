import { NotFound, requireAuth } from '@m0banking/common';
import express, { Request, Response } from 'express';
import { Notification } from '../model/notification';

const router = express.Router();

router.get('/', requireAuth, async (req: Request, res: Response) => {
  const nottification = await Notification.deleteMany({
    userId: req.currentUser.id
  });

  if (!nottification) throw new NotFound('Notifiation not found');

  res.status(204).json({ status: 'success', data: nottification });
});

export { router as deleteAllNofification };
