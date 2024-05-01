import express, { Request, Response } from 'express';
import { requireAuth } from '@m0banking/common';
import { Notification } from '../model/notification';

const router = express.Router();

router.get('/', requireAuth, async (req: Request, res: Response) => {
  const notification = await Notification.find({
    userId: req.currentUser.id
  });

  res.status(200).json({ status: 'success', data: notification });
});

export { router as GetAllNotification };
