import { BadRequest, paramsChecker, requireAuth } from '@m0banking/common';
import express, { Request, Response } from 'express';
import { Txn } from '../models/transaction';

const router = express.Router();

router.get(
  '/summary/:year/:month?',
  requireAuth,

  async (req: Request, res: Response) => {
    const { year } = req.params;

    if (!year || typeof +year !== 'number')
      throw new BadRequest('please provide a valid year');

    const summary = await Txn.aggregate([
      {
        $match: {
          userId: req.currentUser.id,
          createdAt: {
            $gte: `${year}-${req.params.month || '01'}-01`,
            $lte: `${year}-${req.params.month || '12'}-31`
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

    console.log(summary);

    res.status(200).json({
      status: 'success',
      data: summary
    });
  }
);

export { router as txnSummaryRouterByDate };
