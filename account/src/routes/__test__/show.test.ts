import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns a 401 on unauthorized user access', async () => {
  const accountId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .get('/api/v1/account/' + accountId)

    .send()
    .expect(401);
});

it('returns a 400, if a user w/ such id does not exist', async () => {
  const accountId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .get('/api/v1/account/' + accountId)
    .set('Cookie', await global.signin())
    .send()
    .expect(400);
});

it('returns a 400, if user passes invalid mongodb id', async () => {
  await request(app)
    .get('/api/v1/account/' + 'accountId')
    .set('Cookie', await global.signin())
    .send()
    .expect(400);
});
