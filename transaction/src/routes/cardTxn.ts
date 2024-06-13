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
import { Card } from '../model/card';
import { decrypt } from '../service/crypto';
import express, { Request, Response } from 'express';
import {
  AccountStatus,
  BadRequest,
  CardStatus,
  NotFound,
  requestValidator,
  requireAuth,
  TxnStatusEnum
} from '@m0banking/common';
import { Txn } from '../model/transaction';
import { TxnTypeEnum } from '../enums/TxnTypeEnum';
import { TxnMode } from '../enums/TxnModeEnum';
import { Account } from '../model/account';
import { TxnTransferPublisher } from '../events/publisher/TxnTransferPublisher';
import { natsWrapper } from '../natswrapper';

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

    const currentCardTest = (await Card.find())
      .map(card => {
        const decryptedNo = decrypt(card.info.no);

        const decryptedCvv = decrypt(card.info.cvv);

        return {
          ...card,
          info: { ...card.info, no: decryptedNo, cvv: decryptedCvv }
        };
      })
      .find(el => el.info.no === `${cardNumber}`);

    console.log(currentCardTest, 'From the card test');

    const currentCard = await Card.findOne({ account: senderAccount });

    if (!currentCard) throw new BadRequest('Invalid card credentials');

    console.log(currentCard);

    const decryptedCvv = decrypt(currentCard.info.cvv);
    const decryptedCard = decrypt(currentCard.info.no);

    const account = await Account.findById(currentCard.account);

    if (!account) throw new NotFound('Account not found');

    if (
      currentCard.info.billingAddress !== billingAddress ||
      currentCard.info.expiryDate.getMonth() !== +expMonth - 1 ||
      currentCard.info.expiryDate.getFullYear() !== +expYear ||
      decryptedCvv !== '' + cvv ||
      decryptedCard !== '' + cardNumber ||
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
