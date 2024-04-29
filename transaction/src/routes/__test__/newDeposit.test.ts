import request from 'supertest';
import { app } from '../../app';
import { Account } from '../../model/account';
import mongoose from 'mongoose';
import { AccountCurrency, AccountStatus } from '@m0banking/common';

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

it('returns a 401 for unauthitcated user ', async () => {
  await request(app)
    .post('/api/v1/txn/deposit')
    .send()
    .expect(401);
});
