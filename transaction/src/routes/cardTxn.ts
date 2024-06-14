import {
  AccountStatus,
  BadRequest,
  CardStatus,
  CryptoManager,
  Forbidden,
  NotFound,
  requestValidator,
  requireAuth,
  TxnStatusEnum
} from '@m0banking/common';
import express, { Request, Response } from 'express';
import { TxnMode } from '../enums/TxnModeEnum';
import { TxnTypeEnum } from '../enums/TxnTypeEnum';
import { TxnTransferPublisher } from '../events/publisher/TxnTransferPublisher';
import { Account } from '../model/account';
import { Card } from '../model/card';
import { Txn } from '../model/transaction';
import { natsWrapper } from '../natswrapper';
import { decrypt } from '../service/crypto';
import {
  accountValidator,
  billingAddressValidator,
  cardNameValidator,
  cardNumberValidator,
  cvvValidator,
  expiryMonthValidator,
  expiryYearValidator,
  txnAmountValidator,
  txnReasonValidator
} from '../service/validators';

const router = express.Router();

router.post(
  '/card',
  requireAuth,
  [
    cardNumberValidator,
    cvvValidator,
    expiryMonthValidator,
    expiryYearValidator,
    cardNameValidator,
    billingAddressValidator,
    txnAmountValidator,
    txnReasonValidator,
    accountValidator('account'),
    accountValidator('beneficiary')
  ],
  requestValidator,
  async (req: Request, res: Response) => {
    const {
      expMonth,
      expYear,
      no: cardNumber,
      cvv,
      billingAddress,
      cardName,
      amount,
      reason,
      beneficiary,
      account: senderAccount
    } = req.body;

    const currentCard = await Card.findOne({ account: senderAccount });

    if (!currentCard)
      throw new BadRequest('Invalid card credentials: account ');

    console.log(currentCard);

    const isCorrectCardNo = await CryptoManager.compare(
      currentCard.info.no,
      cardNumber
    );

    const isCorrectCardCvv = await CryptoManager.compare(
      currentCard.info.cvv,
      cvv
    );

    const account = await Account.findById(currentCard.account);

    if (!account) throw new NotFound('Account not found');

    if (req.currentUser.id !== account.user.id)
      throw new Forbidden('You are not authorized to perform this action');

    if (
      currentCard.info.billingAddress !== billingAddress ||
      currentCard.info.expiryDate.getMonth() !== +expMonth - 1 ||
      currentCard.info.expiryDate.getFullYear() !== +expYear ||
      !isCorrectCardNo ||
      !isCorrectCardCvv ||
      currentCard.user.name !== cardName
    )
      throw new BadRequest('Invalid card credentials');

    if (currentCard.account.balance <= +amount)
      throw new BadRequest('Insufficient fund');

    if (
      currentCard.info.status === CardStatus.Inactive ||
      currentCard.info.status === CardStatus.Blocked
    )
      throw new BadRequest(' Deactivated card ');

    if (currentCard.info.status === CardStatus.Expired)
      throw new BadRequest('Expired card');

    const beneficiaryAcc = await Account.findById(beneficiary);

    if (!beneficiaryAcc) throw new NotFound('Beneficiary account not fount');

    if (beneficiaryAcc.status !== AccountStatus.Active)
      throw new BadRequest(' Inactive beneficiary account ');

    const updatedAccount = await account.updateOne(
      { balance: account.balance - amount },
      { new: true }
    );

    const updatedBeneficiary = await beneficiaryAcc.updateOne(
      { balance: beneficiaryAcc.balance + +amount },
      { new: true }
    );

    const newTransfer = await Txn.buildTxn({
      account: currentCard.account.id,
      amount,
      status: TxnStatusEnum.Success,
      type: TxnTypeEnum.Transfer,
      mode: TxnMode.Card,
      reason,

      beneficiary: beneficiary.id
    });

    await new TxnTransferPublisher(natsWrapper.client).publish({
      id: newTransfer.id,
      version: newTransfer.version,
      amount: newTransfer.amount,
      account: {
        id: updatedAccount.id,
        userId: updatedAccount.userId,
        balance: updatedAccount.balance,
        version: updatedAccount.version
      },

      beneficiary: {
        id: updatedBeneficiary.id,
        userId: updatedBeneficiary.userId,
        balance: updatedBeneficiary.balance,
        version: updatedBeneficiary.version
      }
    });

    res.status(201).json({ status: 'success', data: newTransfer });
  }
);

export { router as cardTxn };
