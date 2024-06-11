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
      daily: 0,
      weekly: 500,
      monthly: 5000
    })
    .expect(400);
});

it('returns a 400 on invalid weeklyLimit', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .patch(`/${id}/settings`)
    .set('Cookie', await global.signin())
    .send({
      daily: 50,
      weekly: 5000,
      monthly: 500
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

it('returns a 400 on invalid monthlyLimit', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .patch(`/${id}/settings`)
    .set('Cookie', await global.signin())
    .send({
      daily: 50,
      weekly: 5000,
      monthly: 5
    })
    .expect(400);

  await request(app)
    .patch(`/${id}/settings`)
    .set('Cookie', await global.signin())
    .send({
      daily: 500,
      weekly: 500,
      monthly: 0
    })
    .expect(400);
});

it('returns a 404 when the provided id does not match any existing card', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .patch(`/${id}/settings`)
    .set('Cookie', await global.signin())
    .send({
      daily: 50,
      weekly: 500,
      monthly: 5000
    })
    .expect(404);
});
