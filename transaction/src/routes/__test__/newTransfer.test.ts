import { AccountCurrency, AccountStatus } from '@m0banking/common';
import { Account } from '../../model/account';
import mongoose from 'mongoose';

const accountBuilder = async () =>
  await Account.buildAccount({
    currency: AccountCurrency.NGN,

    pin: '1234',

    userId: new mongoose.Types.ObjectId().toHexString(),

    status: AccountStatus.Active,

    id: new mongoose.Types.ObjectId().toHexString(),
    balance: 0,
    version: 0,
    no: 83923939393,
    _block: false
  });
