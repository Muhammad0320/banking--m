import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns a 400  for invalid mongoose  id', async () => {
  await request(app)
    .post('/api/v1/account/block/' + 'shitid')
    .set('Cookie', await global.signin())
    .send()
    .expect(400);
});

it('returns a 401, for unauthorized user', async () => {
  await request(app)
    .post(
      '/api/v1/account/block/' + new mongoose.Types.ObjectId().toHexString()
    )

    .send()
    .expect(401);
});

it('returns a 403, if a user tries to block', async () => {
  await request(app)
    .post(
      '/api/v1/account/block/' + new mongoose.Types.ObjectId().toHexString()
    )
    .set('Cookie', await global.signin())
    .send()
    .expect(403);
});