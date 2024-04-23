import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns a 400 on invalid  mongoose id', async () => {
  await request(app)
    .patch('/api/v1/account/updatePin/shitId')
    .set('Cookie', await global.signin())
    .send()
    .expect(400);
});

it('returns a 404 on invalid mongoose id', async () => {
  const accountId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .patch('/api/v1/account/updatePin/' + accountId)
    .set('Cookie', await global.signin())
    .send()
    .expect(404);
});

it('returns a 400 on invalid input: oldPin ', async () => {
  const accountId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .patch('/api/v1/account/updatePin/' + accountId)
    .set('Cookie', await global.signin())
    .send({
      pin: 2345,
      pinComfirm: 2345,
      oldPin: 92928282828_89
    })
    .expect(404);

  await request(app)
    .patch('/api/v1/account/updatePin/' + accountId)
    .set('Cookie', await global.signin())
    .send({
      pin: 2345,
      pinComfirm: 2345
    })
    .expect(404);
});

it('returns a 400 on invalid input: pin ', async () => {
  const accountId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .patch('/api/v1/account/updatePin/' + accountId)
    .set('Cookie', await global.signin())
    .send({
      pin: 3232,
      pinComfirm: 2345,
      oldPin: 1234
    })
    .expect(404);

  await request(app)
    .patch('/api/v1/account/updatePin/' + accountId)
    .set('Cookie', await global.signin())
    .send({
      pin: 2345,
      pinComfirm: 2345,
      oldPin: 1234
    })
    .expect(404);
});
