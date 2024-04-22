import { requireAuth } from '@m0banking/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { AccountStatus } from '../enums/AccountStatusEnum';
import { AccountTier } from '../enums/AccountTier';
import { AccountCurrency } from '../enums/AccountCurrencyEnum';

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
    body('currency')
      .trim()
      .notEmpty()
      .custom((input: string) =>
        Object.values(AccountCurrency).includes(input as AccountCurrency)
      )
      .withMessage('please provide a valid currency type'),

    body('tier')
      .trim()
      .notEmpty()
      .custom((input: string) =>
        Object.values(AccountTier).includes(input as AccountTier)
      )
      .withMessage('please prove a valid tier'),

    body('pin')
      .isInt({ min: 4, max: 4 })
      .withMessage('Account pin should be exactly 4 numbers')
  ],
  async (req: Request, rees: Response) => {}
);

export { router as createAccountRouter };
