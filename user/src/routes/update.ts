import User from '../model/user';
import express, { Request, Response } from 'express';
import { emailValidator, nameValidator } from '../services/validators';

import {
  BadRequest,
  currentUser,
  Forbidden,
  NotFound,
  paramsChecker,
  requireAuth,
  UserRole
} from '@m0banking/common';

const router = express.Router();

router.patch(
  '/:id',
  currentUser,
  requireAuth,
  paramsChecker('id'),
  [nameValidator().optional(), emailValidator().optional()],
  async (req: Request, res: Response) => {
    const inputs = req.body;

    const idIsMatched = await User.findById(req.params.id);

    if (!idIsMatched) {
      throw new NotFound('User not found');
    }

    const user = await User.findByIdAndUpdate(req.params.id, inputs, {
      new: true
    });

    if (!user) {
      throw new BadRequest('Invalid  inputs');
    }

    // if (user.role === UserRole.User && req.currentUser.id !== user.id) {
    //   throw new Forbidden(
    //     "You are not allowed to update another user's  profile"
    //   );
    // }

    res.status(200).json({ status: 'success', data: user });
  }
);

export { router as updateUserRouter };
