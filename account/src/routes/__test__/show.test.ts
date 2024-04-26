import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { UserRole } from '@m0banking/common';
import { AccountCurrency } from '@m0banking/common';
import { AccountTier } from '../../enums/AccountTier';

it('returns a 401 on unauthorized user access', async () => {
  const accountId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .get('/api/v1/account/' + accountId)

    .send()
    .expect(401);
});

it('returns a 404, if a user w/ such id does not exist', async () => {
  const accountId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .get('/api/v1/account/' + accountId)
    .set('Cookie', await global.signin())
    .send()
    .expect(404);
});

it('returns a 400, if user passes invalid mongoose id', async () => {
  await request(app)
    .get('/api/v1/account/' + 'accountId')
    .set('Cookie', await global.signin())
    .send()
    .expect(400);
});

it('returns a 403, if user tried to check other users account', async () => {
  const {
    body: { data }
  } = await request(app)
    .post('/api/v1/account')
    .set(
      'Cookie',
      await global.signin(new mongoose.Types.ObjectId().toHexString())
    )
    .send({
      currency: AccountCurrency.NGN,
      tier: AccountTier.Basic,
      pin: 1234,
      pinConfirm: 1234
    })
    .expect(201);

  await request(app)
    .get('/api/v1/account/' + data.id)
    .set(
      'Cookie',
      await global.signin(new mongoose.Types.ObjectId().toHexString())
    )
    .send()
    .expect(403);
});

it('returns a 200, if user is an admin', async () => {
  const {
    body: { data }
  } = await request(app)
    .post('/api/v1/account')
    .set(
      'Cookie',
      await global.signin(new mongoose.Types.ObjectId().toHexString())
    )
    .send({
      currency: AccountCurrency.NGN,
      tier: AccountTier.Basic,
      pin: 1234,
      pinConfirm: 1234
    })
    .expect(201);

  await request(app)
    .get('/api/v1/account/' + data.id)
    .set(
      'Cookie',
      await global.signin(
        new mongoose.Types.ObjectId().toHexString(),
        UserRole.Admin
      )
    )
    .send()
    .expect(200);
});

it('returns a 200, if a user checks his/her own account', async () => {
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
    .get('/api/v1/account/' + data.id)
    .set('Cookie', await global.signin(userId))
    .send()
    .expect(200);
});
