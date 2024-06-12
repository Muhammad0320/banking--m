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

    if (!!!account) throw new NotFound('Account not found');

    if (
      req.currentUser.role === UserRole.User &&
      req.currentUser.id !== account.user.id
    )
      throw new Forbidden(
        'You are not allowed to create card for another user'
      );

    const newCard = await Card.buildCard({
      accountId,
      billingAddress,
      networkType,
      type
    });

    res.status(201).json({
      status: 'success',

      message:
        'Card Successfully created. Head over to the `/activate`, for card activation',
      data: newCard
    });
  }
);

export { router as cardCreatedRouter };
