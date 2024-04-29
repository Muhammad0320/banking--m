import { NextFunction, Request, Response } from 'express';

const invalidAttempts = new Map<string, number>();

export const invalidAttemptTracker = (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
