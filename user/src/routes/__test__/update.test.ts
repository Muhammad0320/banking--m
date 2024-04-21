import mongoose from 'mongoose';
import { app } from '../../app';
import request from 'supertest';

it('returns error order that 400, if route exists', async () => {
  const response = await request(app)
    .patch('/api/v1/user/' + new mongoose.Types.ObjectId().toString('hex'))
    .set('Cookie', await global.signin())
    .send();

  expect(response.statusCode).not.toEqual(404);
});

it('returs a 400 on invalid id', async () => {
  await request(app)
    .patch('/api/v1/user/' + new mongoose.Types.ObjectId().toString('hex'))
    .set('Cookie', await global.signin())
    .send({ email: 'njvvfnjnvnjv' })
    .expect(400);
});
