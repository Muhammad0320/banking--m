import request from 'supertest';
import { app } from '../../app';

it('returns a 400  for invalid mongoose  id', async () => {
  await request(app)
    .post('/api/v1/account/block/' + 'shitid')
    .set('Cookie', await global.signin())
    .send()
    .expect(400);
});
