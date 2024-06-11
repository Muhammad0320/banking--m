import request from 'supertest';
import { app } from '../../app';
import { CardNetwork } from '../../enums/CardNewtwork';
import { CardType } from '../../enums/CardType';
import mongoose from 'mongoose';
import { accountBuilder } from '../../test/builders';
import { AccountStatus } from '@m0banking/common';

it('returns a 401 for unauthenticated route access', async () => {
  await request(app)
    .post('/api/v1/card')
    .send({})
    .expect(401);
});

it('retuns a 400, for invalid accountId ', async () => {
  await request(app)
    .post('/api/v1/card')
    .set('Cookie', await global.signin())
    .send({
      accountId: 'shit id',
      billingAddress: 'G50 Balogun gambari compd',
      networkType: CardNetwork.Visa,
      type: CardType.Credit
    })
    .expect(400);

  await request(app)
    .post('/api/v1/card')
    .set('Cookie', await global.signin())
    .send({
      accountId: '',
      billingAddress: 'G50 Balogun gambari compd',
      networkType: CardNetwork.Visa,
      type: CardType.Credit
    })
    .expect(400);
});

it('returns a 400, for invalid billingAddress', async () => {
  await request(app)
    .post('/api/v1/card')
    .set('Cookie', await global.signin())
    .send({
      accountId: new mongoose.Types.ObjectId().toHexString(),
      billingAddress: 'G50',
      networkType: CardNetwork.Visa,
      type: CardType.Credit
    })
    .expect(400);

  await request(app)
    .post('/api/v1/card')
    .set('Cookie', await global.signin())
    .send({
      accountId: new mongoose.Types.ObjectId().toHexString(),
      billingAddress: '',
      networkType: CardNetwork.Visa,
      type: CardType.Credit
    })
    .expect(400);
});

it('returns a 400, for invalid network type', async () => {
  await request(app)
    .post('/api/v1/card')
    .set('Cookie', await global.signin())
    .send({
      accountId: new mongoose.Types.ObjectId().toHexString(),
      billingAddress: 'G50 Balogun gambari compd',
      networkType: 'viso',
      type: CardType.Credit
    })
    .expect(400);

  await request(app)
    .post('/api/v1/card')
    .set('Cookie', await global.signin())
    .send({
      accountId: new mongoose.Types.ObjectId().toHexString(),
      billingAddress: 'G50 Balogun gambari compd',
      networkType: '',
      type: CardType.Credit
    })
    .expect(400);
});

it('returns a 400, for invalid card type ', async () => {
  await request(app)
    .post('/api/v1/card')
    .set('Cookie', await global.signin())
    .send({
      accountId: new mongoose.Types.ObjectId().toHexString(),
      billingAddress: 'G50 Balogun gambari compd',
      networkType: CardNetwork.Visa,

      type: 'credo'
    })
    .expect(400);

  await request(app)
    .post('/api/v1/card')
    .set('Cookie', await global.signin())
    .send({
      accountId: new mongoose.Types.ObjectId().toHexString(),
      billingAddress: 'G50 Balogun gambari compd',
      networkType: CardNetwork.Visa,
      type: ''
    })
    .expect(400);
});

it('returns a 404 on valid but not matched accountId', async () => {
  await request(app)
    .post('/api/v1/card')
    .set('Cookie', await global.signin())
    .send({
      accountId: new mongoose.Types.ObjectId().toHexString(),
      billingAddress: 'G50 Balogun gambari compd',
      networkType: CardNetwork.Visa,
      type: CardType.Credit
    })
    .expect(404);
});

it('returns a 400 on valid but not matched accountId', async () => {
  await request(app)
    .post('/api/v1/card')
    .set('Cookie', await global.signin())
    .send({
      accountId: new mongoose.Types.ObjectId().toHexString(),
      billingAddress: 'G50 Balogun gambari compd',
      networkType: CardNetwork.Visa,
      type: CardType.Credit
    })
    .expect(404);
});

it('returns a 400, if the provided accountId is blocked', async () => {
  const account = await accountBuilder(
    undefined,
    undefined,
    AccountStatus.Blocked
  );

  await request(app)
    .post('/api/v1/card')
    .set('Cookie', await global.signin())
    .send({
      accountId: account.id,
      billingAddress: 'G50 Balogun gambari compd',
      networkType: CardNetwork.Visa,
      type: CardType.Credit
    })
    .expect(400);
});

it('returns a 403, if an user tried to create card for another user', async () => {
  const account = await accountBuilder();

  await request(app)
    .post('/api/v1/card')
    .set('Cookie', await global.signin())
    .send({
      accountId: account.id,
      billingAddress: 'G50 Balogun gambari compd',
      networkType: CardNetwork.Visa,
      type: CardType.Credit
    })
    .expect(403);
});
