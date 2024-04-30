import { requestValidator, requireAuth } from '@m0banking/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { validateAccount } from '../middlewares/validateAccount';
import { Account } from '../model/account';
import { Txn } from '../model/transaction';
import { TxnStatusEnum } from '../enums/TxnStatusEnum';
import { TxnTypeEnum } from '../enums/TxnTypeEnum';
import { TxnWithdrawalPublisher } from '../events/publisher/TxnWithdrawalPublishert';
import { natsWrapper } from '../natswrapper';

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

    await account.updateOne(
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
      account: {
        id: account.id,
        version: account.version,
        balance: account.balance
      }
    });

    res.status(201).json({ status: 'success', data: withdrawal });
  }
);

export { router as createWithdrawalRouter };
