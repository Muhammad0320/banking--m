import { app } from '../../app';
import request from 'supertest';

it('returns a 401, for unauthorized user', async () => {
  await request(app)
    .get('/api/v1/report/summary')
    .send()
    .expect(401);
});
