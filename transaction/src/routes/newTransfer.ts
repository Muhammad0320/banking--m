import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';

const router = express.Router();

router.get(
  '/withdrawal',
  [
    body('amount').isFloat({ gt: 0 }),
    body('accountId')
      .isString()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
  ],

  (req: Request, response: Response) => {}
);

export { router as crreateWithdrawalRouter };
