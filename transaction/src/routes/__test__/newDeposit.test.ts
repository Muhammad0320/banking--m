import request from 'supertest';
import { app } from '../../app';
import { Account } from '../../model/account';
import mongoose from 'mongoose';
import {
  AccountCurrency,
  AccountStatus,
  AccountTier,
  AccountType,
  CryptoManager
} from '@m0banking/common';
import { natsWrapper } from '../../natswrapper';

const accountBuilder = async () => {
  const pin = await CryptoManager.hash('1234');

  return await Account.buildAccount({
    currency: AccountCurrency.NGN,

    pin,

    user: {
      id: new mongoose.Types.ObjectId().toHexString(),
      name: 'Lisan al gaib'
    },

    status: AccountStatus.Active,

    id: new mongoose.Types.ObjectId().toHexString(),
    balance: 0,
    version: 0,
    no: Math.floor(83923939393 * Math.random() * 1.5),
    _block: false,
    tier: AccountTier.Basic,
    type: AccountType.Current
  });
};

it('returns a 401 for unauthitcated user ', async () => {
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

it('returns a 400 for invalid pin', async () => {
  const account = await accountBuilder();

  await request(app)
    .post('/api/v1/txn/deposit')
    .set('Cookie', await global.signin(account.user.id))
    .send({ amount: 100, accountId: account.id })
    .expect(400);

  await request(app)
    .post('/api/v1/txn/deposit')
    .set('Cookie', await global.signin(account.user.id))
    .send({ amount: 240, accountId: account.id, pin: 2212 })
    .expect(400);
});

it('returns a 400, for invalid accountId', async () => {
  const account = await accountBuilder();

  await request(app)
    .post('/api/v1/txn/deposit')
    .set('Cookie', await global.signin(account.user.id))
    .send({ amount: 100, accountId: 'shit id', pin: 1234 })
    .expect(400);

  await request(app)
    .post('/api/v1/txn/deposit')
    .set('Cookie', await global.signin())
    .send({ amount: 100, pin: 2212 })
    .expect(400);
});

it('returns a 404, for valid but incorrect accountId', async () => {
  const account = await accountBuilder();

  await request(app)
    .post('/api/v1/txn/deposit')
    .set('Cookie', await global.signin(account.user.id))
    .send({
      amount: 100,
      accountId: new mongoose.Types.ObjectId().toHexString(),
      pin: 1234
    })
    .expect(404);
});

it('returns a 403, if other user tried to transact with another account', async () => {
  const account = await accountBuilder();

  await request(app)
    .post('/api/v1/txn/deposit')
    .set('Cookie', await global.signin())
    .send({
      amount: 100,
      accountId: account.id,
      pin: 1234
    })
    .expect(403);
});

it('returns returns a 201 when everything is valid ', async () => {
  const account = await accountBuilder();

  const {
    body: { data }
  } = await request(app)
    .post('/api/v1/txn/deposit')
    .set('Cookie', await global.signin(account.user.id))
    .send({
      amount: 1000,
      accountId: account.id,
      pin: 1234
    })
    .expect(201);

  const updatedAccount = await Account.findById(account.id);

  expect(data.amount).toEqual(1000);
  expect(updatedAccount!.balance).toEqual(1000);
});

it(' publishes a TxnDepositCreatedPublisher event when everything is valid ', async () => {
  const account = await accountBuilder();

  await request(app)
    .post('/api/v1/txn/deposit')
    .set('Cookie', await global.signin(account.user.id))
    .send({
      amount: 1000,
      accountId: account.id,
      pin: 1234
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
