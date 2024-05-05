import { requestValidator } from '@m0banking/common';
import {
  passwordConfirmationValidator,
  passwordValidator
} from '../services/validators';
import express, { Request, Response } from 'express';

const router = express.Router();

router.patch(
  '/passwordUpdate',
  passwordValidator('oldPassword'),
  passwordValidator,
  passwordConfirmationValidator,
  requestValidator,
  async (req: Request, res: Response) => {}
);

export { router as passwordUpdateRouter };
