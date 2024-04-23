import {
  BadRequest,
  CryptoManager,
  Forbidden,
  NotFound,
  paramsChecker,
  requireAuth,
  UserRole
} from '@m0banking/common';
import express, { Request, Response } from 'express';
import Account from '../model/account';
import { pinConfirmValidator, pinValidator } from '../services/validators';

const router = express.Router();

router.patch(
  '/updatePin/:id',
  requireAuth,
  paramsChecker('id'),
  [pinValidator(), pinConfirmValidator(), pinValidator('oldPin')],

  async (req: Request, res: Response) => {
    const { pin, oldPin } = req.body;

    const existingAccount = await Account.findById(req.params.id);

    if (!existingAccount) {
      throw new NotFound('Account with such id not found');
    }

    const isSamePin = await CryptoManager.compare(
      existingAccount.pin,
      oldPin + ''
    );

    if (!isSamePin) {
      throw new BadRequest('invalid pin');
    }

    if (
      existingAccount.userId !== req.currentUser.id &&
      req.currentUser.role === UserRole.User
    ) {
      throw new Forbidden(
        "You do not have permission to change other people's pin "
      );
    }

    const hasedPin = await CryptoManager.hash(pin);

    existingAccount.set({ pin: hasedPin });

    await existingAccount.save();

    res.status(200).json({ status: 'success', data: existingAccount });
  }
);

export { router as updatePinRouter };
