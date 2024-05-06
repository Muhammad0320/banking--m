import { app } from '../../app';
import request from 'supertest';

it('returns a 401, for unauthorized user', async () => {
  await request(app)
    .get('/api/v1/report/summary')
    .send()
    .expect(401);
});

it('returns status other than 401, to show that routes exists', async () => {
  const { statusCode } = await request(app)
    .get('/api/v1/report/summary')
    .send();

  expect(statusCode).not.toEqual(404);
});

it('returns a 200 status code when for valid user', async () => {
  const {
    body: { data }
  } = await request(app)
    .get('/api/v1/summary')
    .set('Cookie', await global.signin())
    .send()
    .expect(200);

  expect(data).toBeDefined();
});
