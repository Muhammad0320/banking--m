import request from 'supertest';
import { app } from '../../app';

it('returns a 401 for unauthenticated access', async () => {
  await request(app)
    .post('/api/v1/txn/card')
    .send()
    .expect(401);
});
