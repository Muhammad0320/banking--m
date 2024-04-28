import request from 'supertest';
import { app } from '../../app';
import Account from '../../model/account';
import { AccountTier } from '../../enums/AccountTier';
import { AccountCurrency, UserRole } from '@m0banking/common';
import { User } from '../../model/user';
import mongoose from 'mongoose';
import { natsWrapper } from '../../natswrapper';

it('returns a error other that 404 if the route exists', async () => {
  const response = await request(app)
    .post('/api/v1/account')
    .set('Cookie', await global.signin())
    .send();

  expect(response.statusCode).not.toEqual(404);
});

it('returns a 400 on invalid pin', async () => {
  await request(app)
    .post('/api/v1/account')
    .set('Cookie', await global.signin())
    .send({
      currency: AccountCurrency.NGN,
      tier: AccountTier.Basic,

      pinConfirm: 1234
    })
    .expect(400);
});

it('returns a 400, if pins are not the same', async () => {
  await request(app)
    .post('/api/v1/account')
    .set('Cookie', await global.signin())
    .send({
      currency: AccountCurrency.NGN,
      tier: AccountTier.Basic,
      pin: 6877,
      pinConfirm: 1234
    })
    .expect(400);
});

it('returns a 400, if pins are longer that 4', async () => {
  await request(app)
    .post('/api/v1/account')
    .set('Cookie', await global.signin())
    .send({
      currency: AccountCurrency.NGN,
      tier: AccountTier.Basic,
      pin: 123456,
      pinConfirm: 123456
    })
    .expect(400);
});

it('returns a 401, for unautheticated user', async () => {
  await request(app)
    .post('/api/v1/account')
    .send({
      currency: AccountCurrency.NGN,
      tier: AccountTier.Basic,
      pin: 1234,
      pinConfirm: 1234
    })
    .expect(401);
});

it('returns a 201, for valid inputs', async () => {
  const user = await User.buildUser({
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'lisanalgaib@gmail.com',
    name: 'Shit man',
    password: 'shit-password',
    role: UserRole.User,
    version: 0
  });

  const responseBody1 = await Account.find();

  expect(responseBody1.length).toEqual(0);

  await request(app)
    .post('/api/v1/account')
    .set('Cookie', await global.signin(user.id))
    .send({
      currency: AccountCurrency.NGN,
      tier: AccountTier.Basic,
      pin: 1234,
      pinConfirm: 1234
    })
    .expect(201);

  const responseBody2 = await Account.find();

  expect(responseBody2.length).toEqual(1);
});

it('publishes an AccountCreatedPublisher, if everything is okay', async () => {
  const user = await User.buildUser({
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'lisanalgaib@gmail.com',
    name: 'Shit man',
    password: 'shit-password',
    role: UserRole.User,
    version: 0
  });

  await request(app)
    .post('/api/v1/account')
    .set('Cookie', await global.signin(user.id))
    .send({
      currency: AccountCurrency.NGN,
      tier: AccountTier.Basic,
      pin: 1234,
      pinConfirm: 1234
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
