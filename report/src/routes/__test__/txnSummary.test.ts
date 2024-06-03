import mongoose from 'mongoose';
import { app } from '../../app';
import request from 'supertest';
import {
  AccountCurrency,
  AccountStatus,
  AccountTier,
  AccountType,
  CryptoManager,
  TxnTypeEnum
} from '@m0banking/common';
import { Account } from '../../models/account';
import { Txn } from '../../models/transaction';

const accountBuilder = async (userId: string) => {
  return await Account.buildAccount({
    currency: AccountCurrency.NGN,

    pin: await CryptoManager.hash('1234'),

    userId,

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

const txnBuilder = async (
  amount: number,
  type: TxnTypeEnum,
  userId: string
) => {
  const account = await accountBuilder(userId);

  return await Txn.buildTxn({
    account,
    amount,
    type
  });
};

it('returns status other than 404, to show that routes exists', async () => {
  const { statusCode } = await request(app)
    .get('/api/v1/report/summary')
    .send();

  expect(statusCode).not.toEqual(404);
});

it('returns a 401, for unauthorized user', async () => {
  await request(app)
    .get('/api/v1/report/summary')
    .send()
    .expect(401);
});

it('returns a 200 status code when for valid user', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  txnBuilder(5000, TxnTypeEnum.Deposit, userId);
  txnBuilder(10000, TxnTypeEnum.Deposit, userId);
  txnBuilder(1000, TxnTypeEnum.Deposit, userId);
  txnBuilder(1000, TxnTypeEnum.Withdrawal, userId);
  txnBuilder(900, TxnTypeEnum.Withdrawal, userId);
  txnBuilder(900, TxnTypeEnum.Transfer, userId);

  const {
    body: { data }
  } = await request(app)
    .get('/api/v1/summary')
    .set('Cookie', await global.signin())
    .send()
    .expect(200);

  console.log(data);

  expect(data).toBeDefined();
});
