import jwt from 'jsonwebtoken';
import User from '../model/user';
import {
  emailValidator,
  nameValidator,
  passwordConfirmationValidator,
  passwordValidator
} from '../services/validators';
import { natsWrapper } from '../natswrapper';
import express, { Request, Response } from 'express';
import { BadRequest, requestValidator } from '@m0banking/common';
import { UserCreatedPublisher } from '../events/publisher/UserCreatedPublisher';

const router = express.Router();

router.post(
  '/signup',

  [
    emailValidator(),
    nameValidator(),
    passwordValidator(),
    passwordConfirmationValidator()
  ],

  requestValidator,

  async (req: Request, res: Response) => {
    const { email, ...attrs } = req.body;

    const existingUser = await User.findOne({ email });

    if (!!existingUser) {
      throw new BadRequest(
        'This email is in use, Please use another email and try again! '
      );
    }

    const user = await User.buildUser({ ...attrs, email });

    const token = jwt.sign({ user }, process.env.JWT_KEY!, {
      expiresIn: +process.env.JWT_EXPIRES_IN! * 60 * 60
    });

    req.session = {
      jwt: token
    };

    await new UserCreatedPublisher(natsWrapper.client).publish({
      email: user.email,
      name: user.name,
      password: user.password,
      role: user.role,
      id: user.id
    });

    return res.status(201).json({ status: 'success', data: user });
  }
);

export { router as createUserRouter };
