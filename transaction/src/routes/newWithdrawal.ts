import mongoose from 'mongoose';
import { body } from 'express-validator';
import { Account } from '../model/account';
import { Txn } from '../model/transaction';
import { natsWrapper } from '../natswrapper';
import { TxnTypeEnum } from '../enums/TxnTypeEnum';
import express, { Request, Response } from 'express';
import { TxnStatusEnum } from '../enums/TxnStatusEnum';
import { validateAccount } from '../middlewares/validateAccount';
import { requestValidator, requireAuth } from '@m0banking/common';
import { TxnWithdrawalPublisher } from '../events/publisher/TxnWithdrawalPublishert';

const router = express.Router();

router.post(
  '/withdrawal',
  requireAuth,
  [
    body('amount')
      .isFloat({ gt: 0 })
      .withMessage('Please enter a valid amount!'),
    body('accountId')
      .isString()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Please provide a valid accountId'),

    body('pin')
      .isInt()
      .isLength({ min: 4, max: 4 })
      .withMessage('Please provide a valid pin')
  ],
  requestValidator,
  validateAccount('withdrawal'),
  async (req: Request, res: Response) => {
    const { amount, accountId } = req.body;

    const account = await Account.findById(accountId);

    if (!account) return;

    const updatedAccount = await account.updateOne(
      { balance: account.balance - +amount },
      { new: true }
    );

    const withdrawal = await Txn.buildTxn({
      account: account.id,
      amount,
      status: TxnStatusEnum.Success,
      type: TxnTypeEnum.Withdrawal
    });

    await new TxnWithdrawalPublisher(natsWrapper.client).publish({
      id: withdrawal.id,
      version: withdrawal.version,
      amount: withdrawal.amount,
      account: {
        id: updatedAccount.id,
        userId: updatedAccount.userId,
        version: updatedAccount.version,
        balance: updatedAccount.balance
      }
    });

    res.status(201).json({ status: 'success', data: withdrawal });
  }
);

export { router as createWithdrawalRouter };
