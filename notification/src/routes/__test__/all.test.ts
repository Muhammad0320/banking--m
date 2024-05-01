import request from 'supertest';
import { app } from '../../app';

it('returns a 401 for unauthroized user', async () => {
  await request(app)
    .get('/api/v1/notification')
    .send()
    .expect(401);
});
