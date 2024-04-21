import mongoose from 'mongoose';
import { app } from '../../app';
import request from 'supertest';
import User from '../../model/user';

it('returns error order that 400, if route exists', async () => {
  const response = await request(app)
    .patch('/api/v1/user/' + new mongoose.Types.ObjectId().toString('hex'))
    .set('Cookie', await global.signin())
    .send();

  expect(response.statusCode).not.toEqual(404);
});

it('returs a 400 on invalid id', async () => {
  await request(app)
    .patch('/api/v1/user/' + new mongoose.Types.ObjectId().toString('hex'))
    .set('Cookie', await global.signin())
    .send({ email: 'njvvfnjnvnjv' })
    .expect(404);
});

it('returns a 400 in invalid email', async () => {
  const {
    body: { data: signupData }
  } = await request(app)
    .post('/api/v1/user/signup')
    .send({
      name: 'Lisan Al-gaib',

      email: 'shitman@gmail.com',

      password: 'shijgtneeewr',
      passwordConfirm: 'shijgtnjejngnrgnr'
    })
    .expect(201);

  await request(app)
    .patch('/api/v1/user/' + signupData.id)
    .set('Cookie', await global.signin())
    .send({ email: 'njvvfnjnvnjv' })
    .expect(400);

  const notUpdatedUser = await User.findById(signupData.id);

  expect(notUpdatedUser!.email).toBe('shitman@gmail.com');
});

it('returns a 400 in invalid name', async () => {
  const {
    body: { data: signupData }
  } = await request(app)
    .post('/api/v1/user/signup')
    .send({
      name: 'Lisan Al-gaib',

      email: 'shitman@gmail.com',

      password: 'shijgtneeewr',
      passwordConfirm: 'shijgtnjejngnrgnr'
    })
    .expect(201);

  await request(app)
    .patch('/api/v1/user/' + signupData.id)
    .set('Cookie', await global.signin())
    .send({ name: '' })
    .expect(400);

  const notUpdatedUser = await User.findById(signupData.id);

  expect(notUpdatedUser!.email).toBe('Lisan Al-gaib');
});

it('returns a 200 in invalid name', async () => {
  const {
    body: { data: signupData }
  } = await request(app)
    .post('/api/v1/user/signup')
    .send({
      name: 'Lisan Al-gaib',

      email: 'shitman@gmail.com',

      password: 'shijgtneeewr',
      passwordConfirm: 'shijgtnjejngnrgnr'
    })
    .expect(201);

  await request(app)
    .patch('/api/v1/user/' + signupData.id)
    .set('Cookie', await global.signin())
    .send({ name: 'mehdi Usul' })
    .expect(200);

  const notUpdatedUser = await User.findById(signupData.id);

  expect(notUpdatedUser!.email).toBe('mehdi Usul');
});
