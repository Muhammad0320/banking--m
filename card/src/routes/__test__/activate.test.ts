import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it(' returns a 401 for unauthenticated requests ', async () => {
  await request(app)
    .patch('/shitid/activate')
    .send()
    .expect(401);
});

it('returns a 400 for invalid card ', async () => {
  await request(app)
    .patch('/shitid/activate')
    .set('Cookie', await global.signin())
    .send()
    .expect(401);
});

it('retuns a 404 if the id does not match any existing card', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .patch(`/${id}/activate`)
    .set('Cookie', await global.signin())
    .send()
    .expect(404);
});
