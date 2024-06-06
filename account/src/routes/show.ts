import {
  Forbidden,
  NotFound,
  paramsChecker,
  requireAuth,
  UserRole
} from '@m0banking/common';
import Account from '../model/account';
import express, { Request, Response } from 'express';

const router = express.Router();

router.get(
  '/:id',
  requireAuth,
  paramsChecker('id'),
  async (req: Request, res: Response) => {
    const account = await Account.findById(req.params.id).populate('user');

    if (!!!account) {
      throw new NotFound('Account not found');
    }

    if (
      account.user.id !== req.currentUser.id &&
      req.currentUser.role === UserRole.User
    ) {
      throw new Forbidden(
        "You do not have permission to access other people's account "
      );
    }

    return res.status(200).json({ status: 'success', data: account });
  }
);

export { router as showAccountRouter };
