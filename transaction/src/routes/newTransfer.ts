import { NotFound, requestValidator, requireAuth } from '@m0banking/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { validateAccount } from '../middlewares/validateAccount';
import { Account } from '../model/account';
import { Txn } from '../model/transaction';
import { TxnTypeEnum } from '../enums/TxnTypeEnum';
import { TxnStatusEnum } from '../enums/TxnStatusEnum';
import { TxnTransferPublisher } from '../events/publisher/TxnTransferPublisher';
import { natsWrapper } from '../natswrapper';
import { invalidAttemptTracker } from '../middlewares/invalidAttemptTracker';

const router = express.Router();

router.post(
  '/transfer',
  requireAuth,
  [
    body('amount')
      .isFloat({ gt: 0 })
      .withMessage('Please enter a valid amount!'),
    body('accountId')
      .isString()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Please provide a valid accountId'),

    body('beneficiaryId')
      .isString()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Please provide a valid beneficiaryId'),

    body('pin')
      .isInt()
      .isLength({ min: 4, max: 4 })
      .withMessage('Please provide a valid pin')
  ],
  requestValidator,
  validateAccount('transfer'),

  async (req: Request, res: Response) => {
    const { amount, accountId, beneficiaryId } = req.body;

    const account = await Account.findById(accountId);

    const beneficiary = await Account.findById(beneficiaryId);

    console.log('its transfer');

    if (!account || !beneficiary) throw new NotFound('They are shit');

    console.log(beneficiary);

    console.log('its transfer 2');

    const updatedAccount = await account.updateOne(
      { balance: account.balance - amount },
      { new: true }
    );

    const updatedBeneficiary = await beneficiary.updateOne(
      { balance: beneficiary.balance + +amount },
      { new: true }
    );

    const newTransfer = await Txn.buildTxn({
      amount,
      beneficiary: beneficiary.id,
      account: account.id,
      status: TxnStatusEnum.Success,
      type: TxnTypeEnum.Transfer
    });

    await new TxnTransferPublisher(natsWrapper.client).publish({
      id: newTransfer.id,
      version: newTransfer.version,
      account: {
        id: updatedAccount.id,
        balance: updatedAccount.balance,
        version: updatedAccount.version
      },

      beneficiary: {
        id: updatedBeneficiary.id,
        balance: updatedBeneficiary.balance,
        version: updatedBeneficiary.version
      }
    });

    res.status(201).json({ status: 'success', data: newTransfer });
  }
);

export { router as createTransferRouter };
