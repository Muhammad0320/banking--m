import request from 'supertest';
import { app } from '../../app';
import { UserRole, UserStatus } from '@m0banking/common';
import mongoose from 'mongoose';
import { AccountCurrency } from '../../enums/AccountCurrencyEnum';
import { AccountTier } from '../../enums/AccountTier';

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

      pinConfirm: '1234'
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
      pin: '6877',
      pinConfirm: '1234'
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
      pin: '123456',
      pinConfirm: '123456'
    })
    .expect(400);
});

it('returns a 401, for unautheticated user', async () => {
  await request(app)
    .post('/api/v1/account')

    .send({
      currency: AccountCurrency.NGN,
      tier: AccountTier.Basic,
      pin: '123456',
      pinConfirm: '123456'
    })
    .expect(400);
});
