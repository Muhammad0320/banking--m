import { Card } from '../model/card';
import { CardStatus } from '../enums/CardStatus';
import express, { Request, Response } from 'express';
import {
  BadRequest,
  NotFound,
  paramsChecker,
  requireAuth
} from '@m0banking/common';

const router = express.Router();

router.patch(
  '/:id',
  requireAuth,
  paramsChecker('id'),
  async (req: Request, res: Response) => {
    const card = await Card.findById(req.params.id);

    if (!!!card) throw new NotFound('Card not found');

    if (card.info.status === CardStatus.Blocked)
      throw new BadRequest('Card already blocked');

    const updatedCard = await Card.updateOne(
      { info: { status: CardStatus.Active } },
      { new: true }
    );

    res.status(200).json({ status: 'sucess', data: updatedCard });
  }
);
