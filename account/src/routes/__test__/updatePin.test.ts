import request from 'supertest';
import { app } from '../../app';
import mongoose, { mongo } from 'mongoose';
import { AccountCurrency } from '../../enums/AccountCurrencyEnum';
import { AccountTier } from '../../enums/AccountTier';

it('returns a 400 on invalid  mongoose id', async () => {
  await request(app)
    .patch('/api/v1/account/updatePin/shitId')
    .set('Cookie', await global.signin())
    .send()
    .expect(400);
});

it('returns a 404 on invalid mongoose id', async () => {
  const accountId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .patch('/api/v1/account/updatePin/' + accountId)
    .set('Cookie', await global.signin())
    .send()
    .expect(404);
});

it('returns a 400 on invalid input: oldPin ', async () => {
  const accountId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .patch('/api/v1/account/updatePin/' + accountId)
    .set('Cookie', await global.signin())
    .send({
      pin: 2345,
      pinConfirm: 2345,
      oldPin: 92928282828_89
    })
    .expect(404);

  await request(app)
    .patch('/api/v1/account/updatePin/' + accountId)
    .set('Cookie', await global.signin())
    .send({
      pin: 2345,
      pinConfirm: 2345
    })
    .expect(404);
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
    .expect(404);

  await request(app)
    .patch('/api/v1/account/updatePin/' + accountId)
    .set('Cookie', await global.signin())
    .send({
      pin: 2345,
      pinConfirm: 2345,
      oldPin: 1234
    })
    .expect(404);
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
    .expect(404);

  await request(app)
    .patch('/api/v1/account/updatePin/' + accountId)
    .set('Cookie', await global.signin())
    .send({
      pin: 2345,
      oldPin: 1234
    })
    .expect(404);
});

it('returns a 401, if another user tries to update pin', async () => {
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
    .get('/api/v1/account/updatePin' + data.id)
    .set('Cookie', await global.signin())
    .send()
    .expect(400);
});
