import { NextFunction, Request, Response } from 'express';
import { Account } from '../model/account';
import {
  AccountStatus,
  BadRequest,
  Forbidden,
  NotFound
} from '@m0banking/common';

export const validateAccount = (type?: string) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { amount, accountId } = req.body;

  const account = await Account.findById(accountId);

  if (!account) throw new NotFound('Account not found');

  account.userId !== req.currentUser.id &&
    new Forbidden('You are not allowed to perform this transaction');

  if (account.status === AccountStatus.Blocked)
    throw new Forbidden('This account is blocked');

  if (type === 'withdrawal') {
    account.balance >= amount && new BadRequest('Insufficient fund');

    next();
  }

  if (type === 'transfer') {
    account.balance >= amount && new BadRequest('Insufficient fund');

    const beneficiaryAccount = await Account.findById(req.body.beneficiaryId);

    if (!beneficiaryAccount)
      throw new NotFound('Benebeneficiary Account not found');

    if (beneficiaryAccount.status === AccountStatus.Blocked)
      throw new Forbidden('Beneficiary is blocked');
  }

  next();
};
