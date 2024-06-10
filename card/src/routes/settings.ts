import {
  paramsChecker,
  requestValidator,
  requireAuth
} from '@m0banking/common';
import express, { Response, Request } from 'express';
import {
  dailyLimitsValidator,
  monthlyLimitsValidator,
  weeklyLimitsValidator
} from '../services/validators';

const router = express.Router();

router.patch(
  '/:id/settings',
  requireAuth,
  paramsChecker('id'),
  [dailyLimitsValidator, weeklyLimitsValidator, monthlyLimitsValidator],
  requestValidator,
  async (req: Request, res: Response) => {}
);
