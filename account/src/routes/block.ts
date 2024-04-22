import { BadRequest, NotFound, paramsChecker } from '@m0banking/common';
import express, { Request, Response } from 'express';
import Account from '../model/account';
import { AccountStatus } from '../enums/AccountStatusEnum';

const router = express.Router();

router.patch(
  '/block/:id',
  paramsChecker('id'),
  async (req: Request, res: Response) => {
    const updatedAccount = await Account.findByIdAndUpdate(
      req.params.id,
      { status: AccountStatus.Blocked },
      { new: true }
    );

    if (!updatedAccount) {
      throw new NotFound('User not found');
    }

    res.status(200).json({ status: 'success', data: updatedAccount });
  }
);

export { router as BlockUserRouter };
