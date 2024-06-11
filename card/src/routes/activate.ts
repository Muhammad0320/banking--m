import { Card } from '../model/card';
import { CardStatus } from '../enums/CardStatus';
import express, { Request, Response } from 'express';
import { NotFound, paramsChecker, requireAuth } from '@m0banking/common';

const router = express.Router();

router.patch(
  '/:id/activate',
  requireAuth,
  paramsChecker('id'),
  async (req: Request, res: Response) => {
    const card = await Card.findByIdAndUpdate(
      req.params.id,
      { info: { status: CardStatus.Active } },
      { new: true }
    );

    if (!card) throw new NotFound('Card not found');

    res.status(200).json({ status: 'sucess', data: card });
  }
);

export { router as cardActivatedRouter };
