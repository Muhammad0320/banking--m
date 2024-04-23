import request from 'supertest';
import { app } from '../../app';

it('returns error other than 404, if the route is available', async () => {
  const { statusCode } = await request(app)
    .get('/api/v1/account')
    .set('Cookie', await global.signin())
    .send();

  expect(statusCode).not.toEqual(404);
});
