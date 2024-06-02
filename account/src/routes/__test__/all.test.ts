import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { UserRole } from '@m0banking/common';

it('returns error other than 404, if the route is available', async () => {
  const { statusCode } = await request(app)
    .get('/api/v1/account')
    .set('Cookie', await global.signin())
    .send();

  expect(statusCode).not.toEqual(404);
});

it('returns a 401, if unauthorized user access', async () => {
  await request(app)
    .get('/api/v1/account')

    .send()
    .expect(401);
});

it('returns a 403 for not admin users', async () => {
  await request(app)
    .get('/api/v1/account')
    .set(
      'Cookie',
      await global.signin(new mongoose.Types.ObjectId().toHexString())
    )
    .send()
    .expect(403);
});

it('returns a 200 for admin', async () => {
  await request(app)
    .get('/api/v1/account')
    .set(
      'Cookie',
      await global.signin(
        new mongoose.Types.ObjectId().toHexString(),
        UserRole.Admin
      )
    )
    .send()
    .expect(200);
});
