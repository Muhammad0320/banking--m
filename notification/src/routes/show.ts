import { NotFound, paramsChecker, requireAuth } from '@m0banking/common';
import express, { Request, Response } from 'express';
import { Notification } from './notification';

const router = express.Router();

router.get(
  '/',
  requireAuth,
  paramsChecker('id'),
  async (req: Request, res: Response) => {
    const notification = await Notification.findOne({
      userId: req.currentUser.id,
      _id: req.params.id
    });

    if (!notification) throw new NotFound('Notification not found');

    res.status(200).json({ status: 'success', data: notification });
  }
);

export { router as ShowNotificationRouter };
