import { requireAuth } from '@m0banking/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { AccountStatus } from '../enums/AccountStatusEnum';

const router = express.Router();

router.post(
  '/',
  requireAuth,
  [
    body('userId')
      .trim()
      .notEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('please provide a valid mongoose id'),
    body('status')
      .trim()
      .notEmpty()
      .custom((input: string) =>
        Object.values(AccountStatus).includes(input as AccountStatus)
      )
  ],
  async (req: Request, rees: Response) => {}
);

export { router as createAccountRouter };
