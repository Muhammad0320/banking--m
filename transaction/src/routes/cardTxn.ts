import { BadRequest, requestValidator, requireAuth } from '@m0banking/common';
import express, { Request, Response } from 'express';
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

    const cardNo = (await Card.find())
      .map(card => card.info.no)
      .map(nos => {
        return decrypt(nos);
      })
      .find(no => no === cardNumber);

    if (!cardNo) throw new BadRequest('Invalid credentials');
  }
);
