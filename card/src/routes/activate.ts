import { NotFound, paramsChecker, requireAuth } from '@m0banking/common';
import express, { Request, Response } from 'express';
import { Account } from '../model/account';
import { Card } from '../model/card';
import { CardStatus } from '../enums/CardStatus';

const router = express.Router();

router.patch(
  '/:id',
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
