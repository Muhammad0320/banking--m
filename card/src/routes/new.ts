import {
  AccountStatus,
  BadRequest,
  Forbidden,
  NotFound,
  requestValidator,
  requireAuth,
  UserRole
} from '@m0banking/common';
import {
  accountValidator,
  billingAddressValidator,
  netwokTypeValidator,
  typeValidator
} from '../services/validators';
import { Card } from '../model/card';
import { Account } from '../model/account';
import { DateFxns } from '../services/helper';
import { CardStatus } from '../enums/CardStatus';
import { hashingWork } from '../services/crypto';
import express, { Response, Request } from 'express';

const router = express.Router();

router.post(
  '/',
  requireAuth,
  [
    accountValidator,
    billingAddressValidator,
    netwokTypeValidator,
    typeValidator
  ],
  requestValidator,
  async (req: Request, res: Response) => {
    const { accountId, billingAddress, networkType, type } = req.body;

    const account = await Account.findById(accountId);

    const { yy, mm, dd } = DateFxns();

    if (!!!account) throw new NotFound('Account not found');

    if (account.status !== AccountStatus.Active)
      throw new BadRequest('Your account is blocked');

    const existingCard = await Card.findOne({ account: accountId });

    if (
      req.currentUser.role === UserRole.User &&
      req.currentUser.id !== account.user.id
    )
      throw new Forbidden(
        'You are not allowed to create card for another user'
      );

    if (existingCard?.info.status !== CardStatus.Expired)
      throw new BadRequest("You can't own multiple unexpired cards for now!");

    const {
      cvv: { hashed: hashedCvv, unhashed: unhashedCvv },
      card: { hashed: hashedCard, unhashed: unhashedCard }
    } = hashingWork();

    const newCard = await Card.create({
      account: account.id,

      user: {
        id: account.user.id,
        name: account.user.name
      },

      info: {
        billingAddress,
        network: networkType,
        type,
        no: hashedCard,
        cvv: hashedCvv,
        expiryDate: new Date(yy, mm, dd)
      }
    });

    res.status(201).json({
      status: 'success',

      message:
        'Card Successfully created. Head over to the `/activate`, for card activation',
      data: { ...newCard, cvv: unhashedCvv, no: unhashedCard }
    });
  }
);

export { router as cardCreatedRouter };
