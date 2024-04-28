import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { UserRole } from '@m0banking/common';
import { AccountTier } from '../../enums/AccountTier';
import { AccountCurrency } from '@m0banking/common';
import { User } from '../../model/user';
it('returns 404 for invalid path', async () => {
  await request(app)
    .patch(
      '/api/v1/account/updatePin' + new mongoose.Types.ObjectId().toHexString()
    )
    .set('Cookie', await global.signin())
    .send({
      oldPin: 1234,
      pin: 2345,
      pinConfirm: 2345
    })
    .expect(404);
});

it('returns a 400 on invalid  mongoose id', async () => {
  await request(app)
    .patch('/api/v1/account/updatePin/shitId')
    .set('Cookie', await global.signin())
    .send()
    .expect(400);
});

it('returns a 400 on invalid mongoose id', async () => {
  const accountId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .patch('/api/v1/account/updatePin/' + accountId)
    .set('Cookie', await global.signin())
    .send()
    .expect(400);
});

it('returns a 400 on invalid input: oldPin ', async () => {
  const accountId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .patch('/api/v1/account/updatePin/' + accountId)
    .set('Cookie', await global.signin())
    .send({
      pin: 2345,
      pinConfirm: 2345,
      oldPin: 92928282828
    })
    .expect(400);

  await request(app)
    .patch('/api/v1/account/updatePin/' + accountId)
    .set('Cookie', await global.signin())
    .send({
      pin: 2345,
      pinConfirm: 2345
    })
    .expect(400);
});

it('returns a 400 on invalid input: pin ', async () => {
  const accountId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .patch('/api/v1/account/updatePin/' + accountId)
    .set('Cookie', await global.signin())
    .send({
      pin: 3232,
      pinConfirm: 2345,
      oldPin: 1234
    })
    .expect(400);

  await request(app)
    .patch('/api/v1/account/updatePin/' + accountId)
    .set('Cookie', await global.signin())
    .send({
      pinConfirm: 2345,
      oldPin: 1234
    })
    .expect(400);
});

it('returns a 400 on invalid input: pinConfirm ', async () => {
  const accountId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .patch('/api/v1/account/updatePin/' + accountId)
    .set('Cookie', await global.signin())
    .send({
      pin: 3232,
      pinConfirm: 2345,
      oldPin: 1234
    })
    .expect(400);

  await request(app)
    .patch('/api/v1/account/updatePin/' + accountId)
    .set('Cookie', await global.signin())
    .send({
      pin: 2345,

      oldPin: 1234
    })
    .expect(400);
});

it('returns a 403, if another user tries to update pin', async () => {
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
    .patch('/api/v1/account/updatePin/' + data.id)
    .set('Cookie', await global.signin())
    .send({
      oldPin: 1234,
      pin: 2345,
      pinConfirm: 2345
    })
    .expect(403);
});

it('returns a 400, when rigt user updated w/ incorrect oldpin', async () => {
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
    .patch('/api/v1/account/updatePin/' + data.id)
    .set('Cookie', await global.signin(userId))
    .send({
      oldPin: 2323,
      pin: 2345,
      pinConfirm: 2345
    })
    .expect(400);
});

it(' returns a 200, if admin tried to updatePin ', async () => {
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
    .patch('/api/v1/account/updatePin/' + data.id)
    .set(
      'Cookie',
      await global.signin(
        new mongoose.Types.ObjectId().toHexString(),
        UserRole.Admin
      )
    )
    .send({
      oldPin: 1234,
      pin: 2345,
      pinConfirm: 2345
    })
    .expect(200);
});

it(' returns a 200, if the account ownser tries to updatePin ', async () => {
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

  const path = '/api/v1/account/updatePin/' + data.id;

  console.log(path);

  await request(app)
    .patch(path)
    .set('Cookie', await global.signin(user.id))
    .send({
      oldPin: 1234,
      pin: 2345,
      pinConfirm: 2345
    })
    .expect(200);
});
