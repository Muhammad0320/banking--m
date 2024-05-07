import {
  accessibleTo,
  NotFound,
  paramsChecker,
  requireAuth,
  UserRole
} from '@m0banking/common';
import express, { Request, Response } from 'express';
import Account from '../model/account';
import { AccountStatus } from '@m0banking/common';
import { natsWrapper } from '../natswrapper';
import { AccountBlockPublisher } from '../events/publishers/AccountBlockedPublisher';

const router = express.Router();

router.patch(
  '/block/:id',
  requireAuth,
  paramsChecker('id'),
  accessibleTo(UserRole.Admin, UserRole.CustomerService),
  async (req: Request, res: Response) => {
    const updatedAccount = await Account.findByIdAndUpdate(
      req.params.id,
      { status: AccountStatus.Blocked },
      { new: true }
    );

    if (!updatedAccount) {
      throw new NotFound('User not found');
    }

    await new AccountBlockPublisher(natsWrapper.client).publish({
      id: updatedAccount.id,
      version: updatedAccount.version,
      reason: 'Breaking rules',
      user: {
        id: updatedAccount.user.id,
        name: updatedAccount.user.name
      }
    });

    res.status(204).json({ status: 'success', data: updatedAccount });
  }
);

export { router as blockAccountRouter };
