import { requireAuth } from '@m0banking/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';

const router = express.Router();

router.post(
  '/withdrwal',
  requireAuth,
  [
    body('amount')
      .isFloat({ gt: 0 })
      .withMessage('Please enter a valid amount!'),
    body('accountId')
      .isString()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Please provide a valid accountId')
  ],
  async (req: Request, res: Response) => {}
);

export { router as newWithdrawalRouter };
