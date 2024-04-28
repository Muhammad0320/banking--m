import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { User } from '../../model/user';
import Account from '../../model/account';
import { AccountTier } from '../../enums/AccountTier';
import { AccountCurrency, UserRole } from '@m0banking/common';
import { natsWrapper } from '../../natswrapper';

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

it('publishes an AccountBlockPublisher ', async () => {
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

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('returns a 404, if this user tries to find a blocked account ', async () => {
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

  //   await request(app)
  //     .get('/api/v1/account/' + data.id)
  //     .set('Cookie', await global.signin(userId))
  //     .send()
  //     .expect(404);

  const account = await Account.findById(data.id);

  console.log(account);
});
