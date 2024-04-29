import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Account } from '../../model/account';
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

it('returns a 401, for unautheticated user', async () => {
  await request(app)
    .post('/api/v1/txn/deposit')

    .send({})
    .expect(401);
});

it('returns a  400 for invalid amount', async () => {
  const account = await accountBuilder();

  const beneficiaryAccount = await accountBuilder();

  await request(app)
    .post('/api/v1/txn/deposit')
    .set('Cookie', await global.signin())
    .send({
      amount: 0,
      accountId: account.id,
      pin: account.pin,
      beneficiaryId: beneficiaryAccount.id
    })
    .expect(400);

  await request(app)
    .post('/api/v1/txn/deposit')
    .set('Cookie', await global.signin())
    .send({
      accountId: account.id,
      pin: account.pin,
      beneficiaryId: beneficiaryAccount.id
    })
    .expect(400);
});

it('returns a 400 for invalid ids: account & beneficiary', async () => {
  const account = await accountBuilder();

  const beneficiaryAccount = await accountBuilder();

  await request(app)
    .post('/api/v1/txn/deposit')
    .set('Cookie', await global.signin())
    .send({
      amount: 100,
      accountId: 'shit id',
      pin: account.pin,
      beneficiaryId: beneficiaryAccount.id
    })
    .expect(400);

  await request(app)
    .post('/api/v1/txn/deposit')
    .set('Cookie', await global.signin())
    .send({
      amount: 100,
      accountId: account.id,
      pin: account.pin,
      beneficiaryId: 'shit id'
    })
    .expect(400);
});
