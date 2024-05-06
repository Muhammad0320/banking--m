import { app } from '../../app';
import request from 'supertest';

it('returns a 401, for unauthorized user', async () => {
  await request(app)
    .get('/api/v1/report/summaryByDate/2024')
    .send()
    .expect(401);
});

it('returns status other than 401, to show that routes exists', async () => {
  const { statusCode } = await request(app)
    .get('/api/v1/report/summaryByDate/2024')
    .send();

  expect(statusCode).not.toEqual(404);
});

it('returns a 400, if theres no year', async () => {
  await request(app)
    .get('/api/v1/report/summaryByDate')
    .send()
    .set('Cookie', await global.signin())
    .expect(400);
});

it('returns a 400, if invalid year is provided', async () => {
  await request(app)
    .get('/api/v1/report/summaryByDate/2044')
    .send()
    .set('Cookie', await global.signin())
    .expect(400);
});
