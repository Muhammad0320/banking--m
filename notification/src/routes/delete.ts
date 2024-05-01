import { paramsChecker, requireAuth } from '@m0banking/common';
import express, { Request, Response } from 'express';
import { Notification } from '../model/notification';

const router = express.Router();

router.delete(
  '/id',
  requireAuth,
  paramsChecker('id'),
  async (req: Request, res: Response) => {
    const notification = await Notification.findOneAndDelete({
      userId: req.currentUser.id,
      id: req.params.id
    });

    res.status(204).json({
      status: 'success',
      data: notification
    });
  }
);

export { router as deleteNotification };
