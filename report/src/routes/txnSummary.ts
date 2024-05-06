import { requireAuth } from '@m0banking/common';
import express, { Request, Response } from 'express';
import { Txn } from '../models/transaction';

const router = express.Router();

router.get('/summary', requireAuth, async (req: Request, res: Response) => {
  const summary = await Txn.aggregate([
    {
      $match: {
        userId: req.currentUser.id
      }
    }
  ]);
});

export { router as txnSummaryRouter };
