import request from 'supertest';
import { app } from '../../app';
import { Notification } from '../../model/notification';
import mongoose from 'mongoose';

const notBuilder = async () => {
  return await Notification.buildNotification({
    userId: new mongoose.Types.ObjectId().toHexString(),
    title: 'New Account created',
    description: 'You just created an account '
  });
};

it('returns a 401 for unauthroized user', async () => {
  await request(app)
    .get('/api/v1/notification')
    .send()
    .expect(401);
});

it('returns a 200 for valid request ', async () => {
  const notification = await notBuilder();

  await request(app)
    .get('/api/v1/notification')
    .set('Cookie', await global.signin(notification.userId))
    .send()
    .expect(201);
});
