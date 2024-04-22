import {
  BadRequest,
  CryptoManager,
  NotFound,
  paramsChecker,
  requireAuth
} from '@m0banking/common';
import express, { Request, Response } from 'express';
import Account from '../model/account';

const router = express.Router();

router.patch(
  '/updatePin/:id',
  requireAuth,
  paramsChecker('id'),
  async (req: Request, res: Response) => {
    const { newPin, oldPin } = req.body;

    const existingAccount = await Account.findById(req.params.id);

    if (!existingAccount) {
      throw new NotFound('Account with such id nit found');
    }
  }
);

export { router as updatePinRouter };
