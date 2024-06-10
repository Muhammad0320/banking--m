import {
  NotFound,
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
import { Card } from '../model/card';

const router = express.Router();

router.patch(
  '/:id/settings',
  requireAuth,
  paramsChecker('id'),
  [dailyLimitsValidator, weeklyLimitsValidator, monthlyLimitsValidator],
  requestValidator,
  async (req: Request, res: Response) => {
    const { weekly, monthly, daily } = req.body;

    const card = await Card.findById(req.params.id);

    if (!card) throw new NotFound('Card not found error');

    const updatedCard = await card.updateOne(
      { settings: { weekly, monthly, daily } },
      { new: true }
    );

    res.status(200).json({
      status: 'success',
      card: updatedCard
    });
  }
);
