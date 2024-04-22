import {
  accessibleTo,
  paramsChecker,
  requireAuth,
  UserRole
} from '@m0banking/common';
import express from 'express';
import Account from '../model/account';

const router = express.Router();

router.patch(
  '/unblock/:id',
  requireAuth,
  accessibleTo(UserRole.Admin, UserRole.CustomerService),
  paramsChecker('id'),
  async () => {
    const unblockedUser = await Account.findByIdAndUpdate({});
  }
);

export { router as unblockUserRouter };
