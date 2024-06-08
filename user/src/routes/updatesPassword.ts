import {
  BadRequest,
  CryptoManager,
  currentUser,
  Forbidden,
  NotFound,
  requestValidator,
  requireAuth,
  UserRole
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

    if (user.id !== req.currentUser.id && user.role === UserRole.User) {
      throw new Forbidden("Not allowed to chnage other people's password");
    }

    const newHashedPassword = await CryptoManager.hash(password);

    const updates = [
      ...user.updates,
      {
        updatedField: 'password',
        old: user.password,
        new: newHashedPassword,
        timeStamp: new Date()
      }
    ];

    user.set({ password: newHashedPassword, updates });
    await user.save();

    res.status(200).json({
      status: 'success',
      data: user
    });
  }
);

export { router as passwordUpdateRouter };
