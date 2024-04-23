import request from 'supertest';
import { app } from '../../app';

it('returns a 400 on invalid  mongoose id', async () => {
  await request(app)
    .patch('/api/v1/account/updatePin/shitId')
    .set('Cookie', await global.signin())
    .send()
    .expect(400);
});
