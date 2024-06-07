import User from '../model/user';

import {
  BadRequest,
  currentUser,
  Forbidden,
  NotFound,
  paramsChecker,
  requireAuth,
  UserRole
} from '@m0banking/common';
import { natsWrapper } from '../natswrapper';
import express, { Request, Response } from 'express';
import { emailValidator, nameValidator } from '../services/validators';
import { USerUpdatedPublisher } from '../events/publisher/UserUpdatedPublisher';

const router = express.Router();

router.patch(
  '/:id',
  currentUser,
  requireAuth,
  paramsChecker('id'),
  [nameValidator().optional(), emailValidator().optional()],
  async (req: Request, res: Response) => {
    const inputs = req.body;

    const { name, email, avatar } = inputs;

    console.log(req.params.id, 'from update route handler');

    const idIsMatched = await User.findById(req.params.id);

    if (!idIsMatched) {
      throw new NotFound('User not found');
    }

    let updates = idIsMatched.updates;

    // @ts-ignore
    for (const [key, value] of Object.entries(inputs)) {
      const old = (idIsMatched as any)[key];

      updates.push({
        updatedField: key,
        timeStamp: new Date(),
        new: value as string,
        old
      });
    }

    console.log(
      updates,
      'from route handlersssssssssssssssssss----------------'
    );

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, avatar },
      {
        new: true
      }
    ).select('+password');

    if (!user) {
      throw new BadRequest('Invalid  inputs');
    }

    // if (user.role === UserRole.User && req.currentUser.id !== user.id) {
    //   throw new Forbidden(
    //     "You are not allowed to update another user's  profile"
    //   );
    // }

    await new USerUpdatedPublisher(natsWrapper.client).publish({
      email: user.email,
      name: user.name,
      password: user.password,
      id: user.id,
      signinTimeStamps: user.signinTimeStamps,
      version: user.version + 1,
      updates: user.updates
    });

    res.status(200).json({ status: 'success', data: user });
  }
);

export { router as updateUserRouter };
