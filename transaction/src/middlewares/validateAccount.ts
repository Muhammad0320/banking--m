import { NextFunction, Request, Response } from 'express';
import { Account } from '../model/account';
import {
  AccountStatus,
  BadRequest,
  CryptoManager,
  Forbidden,
  NotFound
} from '@m0banking/common';

export const validateAccount = (type?: string) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { amount, accountId, pin } = req.body;

  const account = await Account.findById(accountId);

  if (!account) throw new NotFound('Account not found');

  if (account.userId !== req.currentUser.id)
    throw new Forbidden('You are not allowed to perform this transaction');

  if (!(await CryptoManager.compare(account.pin, String(pin))))
    throw new BadRequest('Invalid pin');

  if (account.status === AccountStatus.Blocked)
    throw new Forbidden('This account is blocked');

  if (type === 'withdrawal') {
    if (account.balance < amount) throw new BadRequest('Insufficient fund');

    next();
  }

  if (type === 'transfer') {
    const { beneficiaryId } = req.body;

    if (account.balance < amount) throw new BadRequest('Insufficient fund');

    const beneficiaryAccount = await Account.findById(beneficiaryId);

    if (!beneficiaryAccount)
      throw new NotFound('Beneficiary Account not found');

    if (accountId === beneficiaryId)
      throw new BadRequest(
        'You are not allowed to make a transaction to your account 😒'
      );

    if (beneficiaryAccount.status === AccountStatus.Blocked)
      throw new Forbidden('Beneficiary is blocked');

    next();
  }

  next();
};
