import User from '../model/user';

import {
  BadRequest,
  currentUser,
  Forbidden,
  NotFound,
  paramsChecker,
  requestValidator,
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
  requestValidator,

  async (req: Request, res: Response) => {
    const inputs = req.body;

    const { name, email, avatar } = inputs;

    console.log(req.params.id, 'from update route handler');

    const idIsMatched = await User.findById(req.params.id);

    if (!idIsMatched) {
      throw new NotFound('User not found');
    }

    console.log(idIsMatched, 'the mached user');

    console.log(req.currentUser, 'the current user that actally signed in');

    if (
      req.currentUser.role === UserRole.User &&
      req.currentUser.id !== idIsMatched.id
    ) {
      throw new Forbidden(
        "You are not allowed to update another user's  profile"
      );
    }

    const user = await idIsMatched
      .updateOne({
        name: name || idIsMatched.name,
        email: email || idIsMatched.email,
        avatar: avatar || idIsMatched.avatar
      })
      .select('+password');

    if (!user) {
      throw new BadRequest('Invalid  inputs');
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
