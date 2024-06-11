import request from 'supertest';
import { app } from '../../app';

it('it returns a 401, for unautheticated user', async () => {
  await request(app)
    .patch('/shit_id/block')
    .send()
    .expect(401);
});
