import request from 'supertest';
import { app } from '../../app';

it(' returns a 401 for unauthenticated requests ', async () => {
  await request(app)
    .patch('/shitid/activate')
    .send()
    .expect(401);
});



it('returns a 400 for invalid card ', async () => {


  await request(app)
  .patch('/shitid/activate')
  .set('Cookie', await global.signin())
  .send()
  .expect(401);

})