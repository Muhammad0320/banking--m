import express, { Request, Response } from 'express';

import { BadRequest, requestValidator, requireAuth } from '@m0banking/common';
import Account from '../model/account';
import { AccountType } from '../enums/AccountTypeEnum';
import {
  currencyValidator,
  pinConfirmValidator,
  pinValidator,
  tierValidator,
  userIdValidator
} from '../services/validators';

const router = express.Router();

router.post(
  '/',
  requireAuth,
  [
    pinValidator(),
    pinConfirmValidator(),
    tierValidator(),
    currencyValidator(),
    userIdValidator()
  ],
  requestValidator,

  async (req: Request, res: Response) => {
    const { currency, tier, pin, pinConfirm } = req.body;

    // does account existswtith same userID exists , then throw an error.

    const existingAccount = await Account.findOne({
      userId: req.currentUser.id
    });

    if (existingAccount) {
      throw new BadRequest('Account w/ such user already exists');
    }

    // create the account

    const newAccount = await Account.buildAccount({
      currency,
      tier,
      userId: req.currentUser.id,
      pin: `${pin}`,
      pinConfirm: `${pinConfirm}`,
      type: AccountType.Savings
    });

    res.status(201).json({ status: 'success', data: newAccount });
  }
);

export { router as createAccountRouter };
