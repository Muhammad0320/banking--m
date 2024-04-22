import mongoose from 'mongoose';
import { body } from 'express-validator';
import { AccountTier } from '../enums/AccountTier';
import express, { Request, Response } from 'express';
import { AccountCurrency } from '../enums/AccountCurrencyEnum';
import {
  BadRequest,
  emailValidator,
  requestValidator,
  requireAuth
} from '@m0banking/common';
import Account from '../model/account';
import { AccountType } from '../enums/AccountTypeEnum';

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
      .withMessage('Account pin should be exactly 4 numbers'),

    body('pinConfirm')
      .isInt({ min: 4, max: 4 })
      .custom((input: number, { req }) => {
        input === req.body.pin;
      })
      .withMessage('Pins should be the same')
  ],
  requestValidator,

  async (req: Request, res: Response) => {
    const { currency, tier, pin, pinConfirm } = req.body;

    // does account existswtith same userID exists , then throw an error.

    const existingAccount = await Account.findOne({
      userId: req.currentUser.id
    });

    if (existingAccount) {
      throw new BadRequest('Account w/ such user already exists');
    }

    // create the account

    const newAccount = await Account.buildAccount({
      currency,
      tier,
      userId: req.currentUser.id,
      pin: `${pin}`,
      pinConfirm: `${pinConfirm}`,
      type: AccountType.Savings
    });

    res.status(201).json({ status: 'success', data: newAccount });
  }
);

export { router as createAccountRouter };
