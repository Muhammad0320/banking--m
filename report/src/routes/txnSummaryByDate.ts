import { paramsChecker, requireAuth } from '@m0banking/common';
import express, { Request, Response } from 'express';
import { Txn } from '../models/transaction';

const router = express.Router();

router.get(
  '/summary/:year/:month?',
  requireAuth,
  paramsChecker('year'),
  async (req: Request, res: Response) => {
    const { year } = req.params;

    const summary = await Txn.aggregate([
      {
        $match: {
          userId: req.currentUser.id,
          createdAt: {
            $gt: `${year}-01-01`
          }
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
  }
);

export { router as txnSummaryRouter };
