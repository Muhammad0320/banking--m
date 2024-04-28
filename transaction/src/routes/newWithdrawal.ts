import { requireAuth } from '@m0banking/common';
import express, { Request, Response } from 'express';

const router = express.Router();

router.post('/', requireAuth, async (req: Request, res: Response) => {});

export { router as newWithdrawalRouter };
