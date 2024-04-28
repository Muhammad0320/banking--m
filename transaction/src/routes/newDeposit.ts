import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Account } from '../model/account';
import {
  AccountStatus,
  BadRequest,
  Forbidden,
  NotFound
} from '@m0banking/common';

const router = express.Router();

router.post(
  '/deposit',
  [
    body('amount').isFloat({ gt: 0 }),
    body('accountId')
      .isString()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input)),

    body('beneficiaryId')
      .isString()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
  ],
  async (req: Request, res: Response) => {
    const { amount, accountId, beneficiaryId } = req.body;

    const account = await Account.findById(accountId);

    if (!account) {
      throw new NotFound('Account not found');
    }

    const beneficiaryAccount = await Account.findById(beneficiaryId);

    if (!beneficiaryAccount)
      throw new NotFound(" Beneficiary's account not found");

    console.log(account.status === AccountStatus.Blocked);

    if (
      account.status === AccountStatus.Blocked ||
      beneficiaryAccount.status === AccountStatus.Blocked
    )
      throw new Forbidden('This account is blocked');
  }
);

export { router as createTxnRouter };
