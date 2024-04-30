import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Account } from '../../model/account';
import {
  AccountCurrency,
  AccountStatus,
  CryptoManager
} from '@m0banking/common';

const accountBuilder = async () => {
  const pin = await CryptoManager.hash('1234');

  return await Account.buildAccount({
    currency: AccountCurrency.NGN,

    pin,

    userId: new mongoose.Types.ObjectId().toHexString(),

    status: AccountStatus.Active,

    id: new mongoose.Types.ObjectId().toHexString(),
    balance: 0,
    version: 0,
    no: Math.floor(83923939393 * Math.random() * 1.5),
    _block: false
  });
};

it('returns a 401 for unauthrized user', async () => {
  await request(app)
    .post('/api/v1/txn/deposit')
    .send()
    .expect(401);
});

it('returns a 400 for invalid  for invalid amount', async () => {
  const account = await accountBuilder();

  await request(app)
    .post('/api/v1/txn/deposit')
    .set('Cookie', await global.signin())
    .send({ amount: 0, accountId: account.id, pin: 1234 })
    .expect(400);

  await request(app)
    .post('/api/v1/txn/deposit')
    .set('Cookie', await global.signin())
    .send({ accountId: account.id, pin: 1234 })
    .expect(400);
});