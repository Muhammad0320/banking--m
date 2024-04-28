import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Account } from '../model/account';
import {
  AccountStatus,
  Forbidden,
  NotFound,
  requestValidator
} from '@m0banking/common';
import { Txn } from '../model/transaction';
import { TxnStatusEnum } from '../enums/TxnStatusEnum';
import { TxnTypeEnum } from '../enums/TxnTypeEnum';
import { validateAccount } from '../middlewares/validateAccount';

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

  requestValidator,
  validateAccount,
  async (req: Request, res: Response) => {
    const { amount, accountId } = req.body;

    const account = await Account.findById(accountId);

    const updatedAccount = await account!.updateOne({
      balance: account!.balance + amount
    });

    const newTransaction = await Txn.buildTxn({
      amount,
      status: TxnStatusEnum.Success,

      account: updatedAccount,
      type: TxnTypeEnum.Deposit
    });

    res.status(201).json({ status: 'success', data: newTransaction });
  }
);

export { router as createTxnRouter };
