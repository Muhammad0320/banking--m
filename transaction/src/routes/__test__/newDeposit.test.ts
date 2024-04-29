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

it('returns a 400 for invalid  for invalid amount', async () => {
  const account = await accountBuilder();

  request(app)
    .post('/api/v1/txn/deposit')
    .set('Cookie', await global.signin())
    .send({ amount: 0, accountId: account.id, pin: account.pin })
    .expect(400);

  request(app)
    .post('/api/v1/txn/deposit')
    .set('Cookie', await global.signin())
    .send({ accountId: account.id, pin: account.pin })
    .expect(400);
});

it('returns a 400 for invalid pin', async () => {
  const account = await accountBuilder();

  request(app)
    .post('/api/v1/txn/deposit')
    .set('Cookie', await global.signin())
    .send({ amount: 100, accountId: account.id })
    .expect(400);

  request(app)
    .post('/api/v1/txn/deposit')
    .set('Cookie', await global.signin())
    .send({ amount: 240, accountId: account.id, pin: 2212 })
    .expect(400);
});

it('returns a 400, for invalid accountId', async () => {
  const account = await accountBuilder();

  request(app)
    .post('/api/v1/txn/deposit')
    .set('Cookie', await global.signin())
    .send({ amount: 0, accountId: 'shit id', pin: account.pin })
    .expect(400);

  request(app)
    .post('/api/v1/txn/deposit')
    .set('Cookie', await global.signin())
    .send({ amount: 0, pin: 2212 })
    .expect(400);
});
