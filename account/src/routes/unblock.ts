import {
  accessibleTo,
  paramsChecker,
  requireAuth,
  UserRole
} from '@m0banking/common';
import express from 'express';

const router = express.Router();

router.patch(
  '/unblock/:id',
  requireAuth,
  accessibleTo(UserRole.Admin, UserRole.CustomerService),
  paramsChecker('id'),
  async () => {
    const unblockedUser = await '';
  }
);

export { router as unblockUserRouter };
