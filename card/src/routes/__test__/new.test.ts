import request from 'supertest';
import { app } from '../../app';
import { CardNetwork } from '../../enums/CardNewtwork';
import { CardType } from '../../enums/CardType';
import mongoose from 'mongoose';

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
