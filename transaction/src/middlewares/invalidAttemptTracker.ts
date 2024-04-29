import { NextFunction, Request, Response } from 'express';

const invalidAttempts = new Map<string, number>();

export const invalidAttemptTracker = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { accountId } = req.body;

  if (invalidAttempts.has(accountId)) {
    const attempt = invalidAttempts.get(accountId) ?? 1 + 1;

    invalidAttempts.set(accountId, attempt);

    if (attempt === 5) {
      res.locals.block = true;
    }
  } else {
    invalidAttempts.set(accountId, 1);
  }

  next();
};




