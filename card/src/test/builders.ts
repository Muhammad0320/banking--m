import mongoose from 'mongoose';
import { Account } from '../model/account';
import {
  AccountCurrency,
  AccountStatus,
  AccountTier,
  AccountType
} from '@m0banking/common';

export const accountBuilder = async (accId: string, userId: string) => {
  return await Account.buildAccount({
    id: accId || new mongoose.Types.ObjectId().toHexString(),
    no: 2349043000,
    user: {
      name: 'Muadib',
      id: userId || new mongoose.Types.ObjectId().toHexString()
    },
    balance: 9999,
    pin: '1234',
    tier: AccountTier.Private,
    type: AccountType.Current,
    status: AccountStatus.Active,
    currency: AccountCurrency.USD,

    version: 0,
    _block: false
  });
};
