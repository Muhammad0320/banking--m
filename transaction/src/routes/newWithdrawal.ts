import { requestValidator, requireAuth } from '@m0banking/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { validateAccount } from '../middlewares/validateAccount';
import { Account } from '../model/account';
import { Txn } from '../model/transaction';
import { TxnStatusEnum } from '../enums/TxnStatusEnum';
import { TxnTypeEnum } from '../enums/TxnTypeEnum';

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
  requestValidator,
  validateAccount('withdrawal'),
  async (req: Request, res: Response) => {
    const { amount, accountId } = req.body;

    const account = await Account.findById(accountId);

    if (!account) return;

    await account.updateOne({ balance: account.balance - +amount });

    const withdrawal = await Txn.buildTxn({
      account,
      amount,
      status: TxnStatusEnum.Success,
      type: TxnTypeEnum.Withdrawal
    });

    res.status(201).json({ status: 'success', data: withdrawal });
  }
);

export { router as createWithdrawalRouter };
