import { accessibleTo, requireAuth, UserRole } from '@m0banking/common';
import express, { Request, Response } from 'express';
import Account from '../model/account';

const router = express.Router();

router.get(
  '/',
  requireAuth,
  accessibleTo(UserRole.Admin),
  async (req: Request, res: Response) => {
    const allAccounts = await Account.find({});

    res.status(200).json({ status: 'success', data: allAccounts });
  }
);

export { router as allAccountsRouter };
