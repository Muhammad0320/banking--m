import request from 'supertest';
import { app } from '../../app';

it('returns a 401 for unauthrized user', async () => {
  await request(app)
    .post('/api/v1/txn/deposit')
    .send()
    .expect(401);
});
