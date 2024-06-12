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
import { BadRequest, requestValidator, requireAuth } from '@m0banking/common';

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
      cardName
    } = req.body;

    const currentCard = (await Card.find())
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
  }
);
