import { requireAuth } from '@m0banking/common';
import express, { Request, Response } from 'express';
import { Txn } from '../models/transaction';

const router = express.Router();

router.get('/summary', requireAuth, async (req: Request, res: Response) => {
  const summary = await Txn.aggregate([
    {
      $match: {
        userId: req.currentUser.id
      },

      $group: {
        _id: { $toUpper: '$type' },
        avgTxnAmount: { $avg: '$amount' },
        minTxnAmount: { $min: '$amount' },
        maxTxnAmount: { $max: '$amount' },
        totalTxnAmount: { $sum: '$amount' },
        totalNoOfTxn: { $sum: 1 },
        timeStamps: { $push: '$createdAt' }
      },

      $sort: {
        avgTxnAmount: 1
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: summary
  });
});

export { router as txnSummaryRouter };
