import { requestValidator, requireAuth } from '@m0banking/common';
import express, { Response, Request } from 'express';
import {
  accountValidator,
  billingAddressValidator,
  netwokTypeValidator,
  typeValidator
} from '../services/validators';

const router = express.Router();

router.post(
  '/',
  requireAuth,
  [
    accountValidator,
    billingAddressValidator,
    netwokTypeValidator,
    typeValidator
  ],
  requestValidator,
  async (req: Request, res: Response) => {}
);
