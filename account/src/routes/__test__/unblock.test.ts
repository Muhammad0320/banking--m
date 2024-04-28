import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { AccountTier } from '../../enums/AccountTier';
import { UserRole, AccountCurrency, AccountStatus } from '@m0banking/common';
import { User } from '../../model/user';
import { natsWrapper } from '../../natswrapper';

it('returns a 400  for invalid mongoose  id', async () => {
  await request(app)
    .patch('/api/v1/account/unblock/' + 'shitid')
    .set('Cookie', await global.signin())
    .send()
    .expect(400);
});

it('returns a 401, for unauthorized user', async () => {
  await request(app)
    .patch(
      '/api/v1/account/unblock/' + new mongoose.Types.ObjectId().toHexString()
    )

    .send()
    .expect(401);
});

it('returns a 403, if a user tries to unblock', async () => {
  await request(app)
    .patch(
      '/api/v1/account/unblock/' + new mongoose.Types.ObjectId().toHexString()
    )
    .set('Cookie', await global.signin())
    .send()
    .expect(403);
});

it('returns a 404, on invalid id', async () => {
  await request(app)
    .patch(
      '/api/v1/account/unblock/' + new mongoose.Types.ObjectId().toHexString()
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

it('returns a 200, when everything is valid', async () => {
  const user = await User.buildUser({
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'lisanalgaib@gmail.com',
    name: 'Shit man',
    password: 'shit-password',
    role: UserRole.User,
    version: 0
  });

  const {
    body: { data }
  } = await request(app)
    .post('/api/v1/account')
    .set('Cookie', await global.signin(user.id))
    .send({
      currency: AccountCurrency.NGN,
      tier: AccountTier.Basic,
      pin: 1234,
      pinConfirm: 1234
    })
    .expect(201);

  const {
    body: { data: data2 }
  } = await request(app)
    .patch('/api/v1/account/unblock/' + data.id)
    .set(
      'Cookie',
      await global.signin(
        new mongoose.Types.ObjectId().toHexString(),
        UserRole.CustomerService
      )
    )
    .send()
    .expect(200);

  expect(data2.status).toEqual(AccountStatus.Active);
});

it('returns a 200, when everything is valid', async () => {
  const user = await User.buildUser({
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'lisanalgaib@gmail.com',
    name: 'Shit man',
    password: 'shit-password',
    role: UserRole.User,
    version: 0
  });

  const {
    body: { data }
  } = await request(app)
    .post('/api/v1/account')
    .set('Cookie', await global.signin(user.id))
    .send({
      currency: AccountCurrency.NGN,
      tier: AccountTier.Basic,
      pin: 1234,
      pinConfirm: 1234
    })
    .expect(201);

  const {
    body: { data: data2 }
  } = await request(app)
    .patch('/api/v1/account/unblock/' + data.id)
    .set(
      'Cookie',
      await global.signin(
        new mongoose.Types.ObjectId().toHexString(),
        UserRole.CustomerService
      )
    )
    .send()
    .expect(200);

  expect(data2.status).toEqual(AccountStatus.Active);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
