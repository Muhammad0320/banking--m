import { app } from '../../app';
import request from 'supertest';

it('returns a 401, for unauthorized user', async () => {
  await request(app)
    .get('/api/v1/report/summary/2024')
    .send()
    .expect(401);
});

it('returns status other than 401, to show that routes exists', async () => {
  const { statusCode } = await request(app)
    .get('/api/v1/report/summary/2024')
    .send();

  expect(statusCode).not.toEqual(404);
});
