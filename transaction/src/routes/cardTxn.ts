import {
  billingAddressValidator,
  cardNameValidator,
  cardNumberValidator,
  cvvValidator,
  expiryMonthValidator,
  expiryYearValidator
} from '../service/validators';
import { Card } from '../model/card';
import { decrypt } from '../service/crypto';
import express, { Request, Response } from 'express';
import {
  BadRequest,
  CardStatus,
  requestValidator,
  requireAuth
} from '@m0banking/common';
import { Account } from '../model/account';

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
    billingAddressValidator
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
      amount
    } = req.body;

    const currentCard = (await Card.find().populate('account'))
      .map(card => {
        const decryptedNo = decrypt(card.info.no);

        const decryptedCvv = decrypt(card.info.cvv);

        return {
          ...card,
          info: { ...card.info, no: decryptedNo, cvv: decryptedCvv }
        };
      })
      .find(el => el.info.no === `${cardNumber}`);

    const decryptedCvv = decrypt(cvv);

    console.log(currentCard);

    if (!currentCard) throw new BadRequest('Invalid card credentials');

    if (
      currentCard.info.billingAddress !== billingAddress ||
      currentCard.info.expiryDate.getMonth() !== +expMonth - 1 ||
      currentCard.info.expiryDate.getFullYear() !== +expYear ||
      currentCard.info.cvv !== decryptedCvv ||
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
  }
);
