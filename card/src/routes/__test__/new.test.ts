import request from 'supertest';
import { app } from '../../app';

it('returns a 401 for unauthenticated route access', async () => {
  await request(app)
    .post('/api/v1/card')
    .send({})
    .expect(401);
});
