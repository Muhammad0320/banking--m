import {
  BadRequest,
  CryptoManager,
  currentUser,
  NotFound,
  requestValidator,
  requireAuth
} from '@m0banking/common';
import {
  passwordConfirmationValidator,
  passwordValidator
} from '../services/validators';
import express, { Request, Response } from 'express';
import User from '../model/user';

const router = express.Router();

router.patch(
  '/passwordUpdate',
  currentUser,
  requireAuth,
  passwordValidator('oldPassword'),
  passwordValidator,
  passwordConfirmationValidator,
  requestValidator,
  async (req: Request, res: Response) => {
    const { oldPassword, password } = req.body;

    const user = await User.findById(req.currentUser.id).select('+password');

    if (!!!user) {
      throw new NotFound('User not found');
    }

    if (!(await CryptoManager.compare(user.password, oldPassword))) {
      throw new BadRequest('Ivalid old pin');
    }

    const updates = user.updates.push({
      updatedField: 'password',
      old: oldPassword,
      new: password,
      timeStamp: new Date()
    });

    user.set({ password, updates });

    await user.save();

    res.status(200).json({
      status: 'success',
      data: user
    });
  }
);

export { router as passwordUpdateRouter };
