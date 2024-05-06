import { BadRequest, paramsChecker, requireAuth } from '@m0banking/common';
import express, { Request, Response } from 'express';
import { Txn } from '../models/transaction';

const router = express.Router();

router.get(
  '/summaryByDate/:year/:month?',
  requireAuth,

  async (req: Request, res: Response) => {
    const { year } = req.params;

    const month = req.params?.month;

    const date = new Date();

    if (!year || typeof +year !== 'number' || +year > date.getFullYear())
      throw new BadRequest('please provide a valid year');

    if (month || typeof +month !== 'number' || +month > date.getMonth())
      throw new BadRequest('please provide a valid month');

    const summary = await Txn.aggregate([
      {
        $match: {
          userId: req.currentUser.id,
          createdAt: {
            $gte: `${year}-${month || '01'}-01`,
            $lte: `${year}-${month || '12'}-31`
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
