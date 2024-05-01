import { paramsChecker, requireAuth } from '@m0banking/common';
import express, { Request, Response } from 'express';

const router = express.Router();

router.delete(
  '/',
  requireAuth,
  paramsChecker('id'),
  async (req: Request, res: Response) => {}
);

export { router as deleteAllNotification };
