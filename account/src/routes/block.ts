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

    res.status(204).json({ status: 'success', data: updatedAccount });
  }
);

export { router as blockAccountRouter };
