import request from 'supertest';
import { app } from '../../app';

it('returns a error other that 404 if the route exists', async () => {
  const response = await request(app)
    .post('/api/v1/account')
    .set('Cookie', await global.signin())
    .send();

  expect(response.statusCode).not.toEqual(404);
});
