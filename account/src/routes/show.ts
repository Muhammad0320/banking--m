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
    console.log(req.params.id, 'from route handler');

    const account = await Account.findById(req.params.id);

    console.log(account, 'from the route handler');

    if (!!!account) {
      console.log(!!!account, ' is this true???');

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
