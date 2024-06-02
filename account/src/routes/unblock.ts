import {
  accessibleTo,
  NotFound,
  paramsChecker,
  requireAuth,
  UserRole
} from '@m0banking/common';
import Account from '../model/account';
import { natsWrapper } from '../natswrapper';
import { AccountStatus } from '@m0banking/common';
import express, { Request, Response } from 'express';
import { AccountUnblockedPublisher } from '../events/publishers/AccountUnblockedPublisher';

const router = express.Router();

router.patch(
  '/unblock/:id',
  requireAuth,
  paramsChecker('id'),
  accessibleTo(UserRole.Admin, UserRole.CustomerService),
  async (req: Request, res: Response) => {
    const unblockedAccount = await Account.findByIdAndUpdate(
      req.params.id,
      {
        status: AccountStatus.Active
      },
      { new: true }
    );

    if (!unblockedAccount) {
      throw new NotFound('Account not found');
    }

    await new AccountUnblockedPublisher(natsWrapper.client).publish({
      id: unblockedAccount.id,
      version: unblockedAccount.version,
      user: {
        id: unblockedAccount.user.id,
        name: unblockedAccount.user.name
      }
    });

    res.status(200).json({ status: 'success', data: unblockedAccount });
  }
);

export { router as unblockAccountRouter };
