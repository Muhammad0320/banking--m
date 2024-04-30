import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Account } from '../../model/account';
import {
  AccountCurrency,
  AccountStatus,
  CryptoManager
} from '@m0banking/common';

const accountBuilder = async (bal?: number) => {
  const accountSender = new mongoose.Types.ObjectId().toHexString();

  const userSender = new mongoose.Types.ObjectId().toHexString();

  return await Account.buildAccount({
    currency: AccountCurrency.NGN,

    pin: await CryptoManager.hash('1234'),

    userId: userSender,

    status: AccountStatus.Active,

    id: accountSender,
    balance: bal || 0,
    version: 0,
    no: Math.floor(83923939393 * Math.random() * 1.5),
    _block: false
  });
};

const benAccountBuilder = async () => {
  const accountSender = new mongoose.Types.ObjectId().toHexString();

  const userSender = new mongoose.Types.ObjectId().toHexString();

  return await Account.buildAccount({
    currency: AccountCurrency.NGN,

    pin: await CryptoManager.hash('1234'),

    userId: userSender,

    status: AccountStatus.Active,

    id: accountSender,
    balance: 0,
    version: 0,
    no: Math.floor(83923939393 * Math.random() * 1.5),
    _block: false
  });
};

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

  const beneficiaryAccount = await benAccountBuilder();

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

  const beneficiaryAccount = await benAccountBuilder();

  await request(app)
    .post('/api/v1/txn/transfer')
    .set('Cookie', await global.signin(account.userId))
    .send({
      amount: 100,
      accountId: account.id,
      pin: 1237,
      beneficiaryId: beneficiaryAccount.id
    })
    .expect(400);
});

it('returns a 400 for a transaction higher than balance ', async () => {
  const account = await accountBuilder();

  const beneficiaryAccount = await benAccountBuilder();

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

it('returns  a 400, if beneficiary the ids are the same', async () => {
  const account = await accountBuilder();

  await request(app)
    .post('/api/v1/txn/transfer')
    .set('Cookie', await global.signin(account.userId))
    .send({
      amount: 100,
      accountId: account.id,
      pin: 1234,
      beneficiaryId: account.id
    })
    .expect(400);
});

it('returns a 404, if the beneficiary account is not found', async () => {
  const account = await accountBuilder();

  await request(app)
    .post('/api/v1/txn/transfer')
    .set('Cookie', await global.signin(account.userId))
    .send({
      amount: 100,
      accountId: account.id,
      pin: 1234,
      beneficiaryId: new mongoose.Types.ObjectId().toHexString()
    })
    .expect(404);
});

it('returns an 201 when everything is valid', async () => {
  const account = await accountBuilder(5000);

  const beneficiaryAccount = await benAccountBuilder();

  const {
    body: { data }
  } = await request(app)
    .post('/api/v1/txn/transfer')
    .set('Cookie', await global.signin(account.userId))
    .send({
      amount: 100,
      accountId: account.id,
      pin: 1234,
      beneficiaryId: beneficiaryAccount.id
    })
    .expect(201);

  expect(data.amount).toEqual(100);

  const updatedAccount = await Account.findById(account.id);
  const updatedBen = await Account.findById(beneficiaryAccount.id);

  expect(updatedAccount!.balance).toEqual(4900);
  expect(updatedBen!.balance).toEqual(100);
});
