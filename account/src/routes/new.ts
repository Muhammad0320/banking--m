import Account from '../model/account';
import express, { Request, Response } from 'express';
import { AccountType } from '../enums/AccountTypeEnum';
import {
  BadRequest,
  NotFound,
  requestValidator,
  requireAuth
} from '@m0banking/common';
import {
  currencyValidator,
  pinConfirmValidator,
  pinValidator,
  tierValidator
} from '../services/validators';
import { User } from '../model/user';

const router = express.Router();

router.post(
  '/',
  requireAuth,
  [pinValidator(), pinConfirmValidator(), tierValidator(), currencyValidator()],
  requestValidator,

  async (req: Request, res: Response) => {
    const { currency, tier, pin, pinConfirm } = req.body;

    const user = await User.findById(req.currentUser.id);

    if (!user) throw new NotFound('user nor found');

    // does account existswtith same userID exists , then throw an error.

    const existingAccount = await Account.findOne({
      user: user.id
    });

    if (existingAccount) {
      throw new BadRequest('Account w/ such user already exists');
    }

    // create the account

    const newAccount = await Account.buildAccount({
      currency,
      tier,
      user,
      pin: `${pin}`,
      pinConfirm: `${pinConfirm}`,
      type: AccountType.Savings
    });

    res.status(201).json({ status: 'success', data: newAccount });
  }
);

export { router as createAccountRouter };
