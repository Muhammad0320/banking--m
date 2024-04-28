import { NotFound, requestValidator, requireAuth } from '@m0banking/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { validateAccount } from '../middlewares/validateAccount';
import { Account } from '../model/account';
import { Txn } from '../model/transaction';
import { TxnTypeEnum } from '../enums/TxnTypeEnum';
import { TxnStatusEnum } from '../enums/TxnStatusEnum';

const router = express.Router();

router.get(
  '/transfer',
  requireAuth,
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
  validateAccount('transfer'),
  async (req: Request, res: Response) => {
    const { amount, accountId, beneficiaryId } = req.body;

    const account = await Account.findById(accountId);

    const beneficiary = await Account.findById(beneficiaryId);

    if (!account || !beneficiary) throw new NotFound('');

    await account!.updateOne({ balance: account!.balance - amount });

    await beneficiary!.updateOne({ balance: beneficiary!.balance + +amount });

    const newTransfer = await Txn.buildTxn({
      amount,
      beneficiary,
      account,
      status: TxnStatusEnum.Success,
      type: TxnTypeEnum.Transfer
    });

    res.status(201).json({ status: 'success', data: newTransfer });
  }
);

export { router as crreateWithdrawalRouter };
