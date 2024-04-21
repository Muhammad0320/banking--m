import User from '../model/user';
import express, { Request, Response } from 'express';
import { emailValidator, nameValidator } from '../services/validators';
import {
  BadRequest,
  currentUser,
  NotFound,
  paramsChecker,
  requireAuth
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

    res.status(200).json({ status: 'success', data: user });
  }
);

export { router as updateUserRouter };
