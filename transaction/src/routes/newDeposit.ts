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
    const { amount, accountId } = req.body;

    const account = await Account.findById(accountId);

    if (!account) throw new NotFound('Account not found');

    if (account.status === AccountStatus.Blocked)
      throw new Forbidden('This account is blocked');

    const updatedAccount = await account.updateOne({
      balance: account.balance + amount
    });

    res.status(201).json({ status: 'success', data: updatedAccount });
  }
);

export { router as createTxnRouter };
