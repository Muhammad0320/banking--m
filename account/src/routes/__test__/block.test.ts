import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { UserRole } from '@m0banking/common';
import { AccountTier } from '../../enums/AccountTier';
import { AccountCurrency } from '../../enums/AccountCurrencyEnum';

it('returns a 400  for invalid mongoose  id', async () => {
  await request(app)
    .patch('/api/v1/account/block/' + 'shitid')
    .set('Cookie', await global.signin())
    .send()
    .expect(400);
});

it('returns a 401, for unauthorized user', async () => {
  await request(app)
    .patch(
      '/api/v1/account/block/' + new mongoose.Types.ObjectId().toHexString()
    )

    .send()
    .expect(401);
});

it('returns a 403, if a user tries to block', async () => {
  await request(app)
    .patch(
      '/api/v1/account/block/' + new mongoose.Types.ObjectId().toHexString()
    )
    .set('Cookie', await global.signin())
    .send()
    .expect(403);
});

it('returns a 404, on invalid id', async () => {
  await request(app)
    .patch(
      '/api/v1/account/block/' + new mongoose.Types.ObjectId().toHexString()
    )
    .set(
      'Cookie',
      await global.signin(
        new mongoose.Types.ObjectId().toHexString(),
        UserRole.CustomerService
      )
    )
    .send()
    .expect(404);
});

it('returns a 204, when everything is valid', async () => {
  const {
    body: { data }
  } = await request(app)
    .post('/api/v1/account')
    .set('Cookie', await global.signin())
    .send({
      currency: AccountCurrency.NGN,
      tier: AccountTier.Basic,
      pin: 1234,
      pinConfirm: 1234
    })
    .expect(201);

  await request(app)
    .patch('/api/v1/account/block/' + data.id)
    .set(
      'Cookie',
      await global.signin(
        new mongoose.Types.ObjectId().toHexString(),
        UserRole.CustomerService
      )
    )
    .send()
    .expect(204);
});

it('returns a 404, if this user tries to find a blocked account ', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const {
    body: { data }
  } = await request(app)
    .post('/api/v1/account')
    .set('Cookie', await global.signin(userId))
    .send({
      currency: AccountCurrency.NGN,
      tier: AccountTier.Basic,
      pin: 1234,
      pinConfirm: 1234
    })
    .expect(201);

  await request(app)
    .patch('/api/v1/account/block/' + data.id)
    .set(
      'Cookie',
      await global.signin(
        new mongoose.Types.ObjectId().toHexString(),
        UserRole.CustomerService
      )
    )
    .send()
    .expect(204);

  await request(app)
    .get('/api/v1/account/' + data.id)
    .set('Cookie', await global.signin(userId))
    .send()
    .expect(404);
});
