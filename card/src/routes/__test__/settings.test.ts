import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it(' returns a 401 for unauthenticated requests ', async () => {
  await request(app)
    .patch('/shitid/settings')
    .send()
    .expect(401);
});

it('returns a 400 for invalid card ', async () => {
  await request(app)
    .patch('/shitid/settings')
    .set('Cookie', await global.signin())
    .send()
    .expect(400);
});

it('returns a 400 on invalid dailyLimit', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .patch(`/${id}/settings`)
    .set('Cookie', await global.signin())
    .send({
      daily: 500,
      weekly: 50,
      monthly: 5000
    })
    .expect(400);

  await request(app)
    .patch(`/${id}/settings`)
    .set('Cookie', await global.signin())
    .send({
      daily: 500,
      weekly: 0,
      monthly: 5000
    })
    .expect(400);
});
