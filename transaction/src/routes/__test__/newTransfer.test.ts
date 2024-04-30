import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Account } from '../../model/account';
import {
  AccountCurrency,
  AccountStatus,
  CryptoManager
} from '@m0banking/common';

const accountBuilder = async () =>
  await Account.buildAccount({
    currency: AccountCurrency.NGN,

    pin: await CryptoManager.hash('1234'),

    userId: new mongoose.Types.ObjectId().toHexString(),

    status: AccountStatus.Active,

    id: new mongoose.Types.ObjectId().toHexString(),
    balance: 0,
    version: 0,
    no: Math.floor(83923939393 * Math.random() * 1.5),
    _block: false
  });

it('returns a 401, for unautheticated user', async () => {
  await request(app)
    .post('/api/v1/txn/transfer')
    .send({})
    .expect(401);
});

it('returns a  400 for invalid amount', async () => {
  const account = await accountBuilder();

  const beneficiaryAccount = await accountBuilder();

  await request(app)
    .post('/api/v1/txn/transfer')
    .set('Cookie', await global.signin())
    .send({
      amount: 0,
      accountId: account.id,
      pin: 1234,
      beneficiaryId: beneficiaryAccount.id
    })
    .expect(400);

  await request(app)
    .post('/api/v1/txn/transfer')
    .set('Cookie', await global.signin())
    .send({
      accountId: account.id,
      pin: 1234,
      beneficiaryId: beneficiaryAccount.id
    })
    .expect(400);
});

it('returns a 400 for invalid ids: account & beneficiary', async () => {
  const account = await accountBuilder();

  const beneficiaryAccount = await accountBuilder();

  await request(app)
    .post('/api/v1/txn/transfer')
    .set('Cookie', await global.signin())
    .send({
      amount: 100,
      accountId: 'shit id',
      pin: 1234,
      beneficiaryId: beneficiaryAccount.id
    })
    .expect(400);

  await request(app)
    .post('/api/v1/txn/transfer')
    .set('Cookie', await global.signin())
    .send({
      amount: 100,
      accountId: account.id,
      pin: 1234,
      beneficiaryId: 'shit id'
    })
    .expect(400);
});

it('returns a  400 for invalid pin', async () => {
  const account = await accountBuilder();

  const beneficiaryAccount = await accountBuilder();

  await request(app)
    .post('/api/v1/txn/transfer')
    .set('Cookie', await global.signin(account.userId))
    .send({
      amount: 100,
      accountId: account.id,
      pin: 1234,
      beneficiaryId: beneficiaryAccount.id
    })
    .expect(400);
});
