import { paramsChecker } from '@m0banking/common';
import express, { Request, Response } from 'express';

const router = express.Router();

router.patch(
  '/block/:id',
  paramsChecker('id'),
  async (req: Request, res: Response) => {}
);

export { router as BlockUserRouter };
