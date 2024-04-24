import {
  accessibleTo,
  NotFound,
  paramsChecker,
  requireAuth,
  UserRole
} from '@m0banking/common';
import express, { Request, Response } from 'express';
import Account from '../model/account';
import { AccountStatus } from '../enums/AccountStatusEnum';

const router = express.Router();

router.patch(
  '/unblock/:id',
  requireAuth,
  accessibleTo(UserRole.Admin, UserRole.CustomerService),
  paramsChecker('id'),
  async (req: Request, res: Response) => {
    const unblockedUser = await Account.findByIdAndUpdate(
      req.params.id,
      {
        status: AccountStatus.Active
      },
      { new: true }
    );

    if (!unblockedUser) {
      throw new NotFound('Account not found');
    }

    res.status(200).json({ status: 'success', data: unblockedUser });
  }
);

export { router as unblockAccountRouter };
