import request from 'supertest';
import { app } from '../../app';

it('returns a 401 for unauthenticated route access', async () => {
  await request(app)
    .post('/api/v1/card')
    .send({})
    .expect(401);
});

it('retuns a 400, for invalid accountId ', async () => {
  await request(app)
    .post('/api/v1/card')
    .set('Cookie', await global.signin())
    .send({})
    .expect(401);
});

it('returns a 404 on valid but not matched accountId', () => {});
