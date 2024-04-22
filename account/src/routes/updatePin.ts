import {
  BadRequest,
  CryptoManager,
  NotFound,
  paramsChecker,
  requireAuth
} from '@m0banking/common';
import express, { Request, Response } from 'express';
import Account from '../model/account';
import { pinConfirmValidator, pinValidator } from '../services/validators';

const router = express.Router();

router.patch(
  '/updatePin/:id',
  requireAuth,
  paramsChecker('id'),
  [pinValidator(), pinConfirmValidator()],
  async (req: Request, res: Response) => {
    const { newPin, oldPin } = req.body;

    const existingAccount = await Account.findById(req.params.id);

    if (!existingAccount) {
      throw new NotFound('Account with such id nit found');
    }

    const isSamePin = await CryptoManager.compare(existingAccount.pin, oldPin);

    if (!isSamePin) {
      throw new BadRequest('Incorrect pin');
    }

    const hasedPin = await CryptoManager.hash(newPin);

    existingAccount.set({ pin: hasedPin });

    await existingAccount.save();

    res.status(200).json({ status: 'success', data: existingAccount });
  }
);

export { router as updatePinRouter };
