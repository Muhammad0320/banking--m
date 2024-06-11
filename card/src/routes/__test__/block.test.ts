import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('it returns a 401 for unautheticated user', async () => {
  await request(app)
    .patch('/shit_id/block')
    .send()
    .expect(401);
});

it('returns a 404 if the provided id is nit matched w/ any card ', async () => {
  const cardId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .patch(`/${cardId}/block`)
    .set('Cookie', await global.signin())
    .send()
    .expect(404);
});
