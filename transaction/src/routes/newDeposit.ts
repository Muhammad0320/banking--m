import mongoose from 'mongoose';
import { body } from 'express-validator';
import { Account } from '../model/account';
import { Txn } from '../model/transaction';
import { natsWrapper } from '../natswrapper';
import { TxnTypeEnum } from '../enums/TxnTypeEnum';
import express, { Request, Response } from 'express';
import { TxnStatusEnum } from '../enums/TxnStatusEnum';
import { validateAccount } from '../middlewares/validateAccount';
import { NotFound, requestValidator, requireAuth } from '@m0banking/common';
import { TxnDepositCreatedPublisher } from '../events/publisher/TxnDepositCreatedPublisher';

const router = express.Router();

router.post(
  '/deposit',
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
  validateAccount('deposit'),
  async (req: Request, res: Response) => {
    const { amount, accountId } = req.body;

    const account = await Account.findById(accountId);

    if (!account) throw new NotFound('');

    const updatedAccount = await account.updateOne(
      {
        balance: account!.balance + amount
      },
      { new: true }
    );

    const newTransaction = await Txn.buildTxn({
      amount,
      status: TxnStatusEnum.Success,

      account: updatedAccount,
      type: TxnTypeEnum.Deposit
    });

    await new TxnDepositCreatedPublisher(natsWrapper.client).publish({
      id: newTransaction.id,
      version: newTransaction.version,
      account: {
        id: updatedAccount.id,
        balance: updatedAccount.balance,
        version: updatedAccount.version
      }
    });

    res.status(201).json({ status: 'success', data: newTransaction });
  }
);

export { router as createTxnRouter };
