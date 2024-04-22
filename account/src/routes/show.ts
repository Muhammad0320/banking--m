import {
  BadRequest,
  Forbidden,
  NotFound,
  paramsChecker,
  requireAuth,
  UserRole
} from '@m0banking/common';
import express, { Request, Response } from 'express';
import Account from '../model/account';

const router = express.Router();

router.get(
  '/:id',
  requireAuth,
  paramsChecker('id'),
  async (req: Request, res: Response) => {
    const account = await Account.findById(req.params.id);

    if (!account) {
      throw new NotFound('Account not found');
    }

    if (
      account.userId !== req.currentUser.id &&
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
