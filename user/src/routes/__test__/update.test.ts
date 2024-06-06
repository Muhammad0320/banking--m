import mongoose from 'mongoose';
import { app } from '../../app';
import request from 'supertest';
import User from '../../model/user';
import { natsWrapper } from '../../natswrapper';

it('returs a 404 on invalid id', async () => {
  await request(app)
    .patch('/api/v1/user/' + new mongoose.Types.ObjectId().toString('hex'))
    .set('Cookie', await global.signin())
    .send({ email: 'njvvfnjnvnjv' })
    .expect(404);
});

it('returns a 400 in invalid email', async () => {
  console.log(await User.find(), '11111111111111');

  const {
    body: { data: signupData }
  } = await request(app)
    .post('/api/v1/user/signup')
    .send({
      name: 'shit man',
      email: 'shitman1@gmail.com',
      password: 'shijgtnjngnrgnr',
      passwordConfirm: 'shijgtnjngnrgnr'
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
  console.log(await User.find(), '2222222222222222222222222');

  const {
    body: { data: signupData }
  } = await request(app)
    .post('/api/v1/user/signup')
    .send({
      name: 'shit man',
      email: 'shitman2@gmail.com',
      password: 'shijgtnjngnrgnr',
      passwordConfirm: 'shijgtnjngnrgnr'
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
  console.log(await User.find(), '333333333333333333333333');

  const {
    body: { data: signupData }
  } = await request(app)
    .post('/api/v1/user/signup')
    .send({
      name: 'shit man',
      email: 'shitman3@gmail.com',
      password: 'shijgtnjngnrgnr',
      passwordConfirm: 'shijgtnjngnrgnr'
    })
    .expect(201);

  await request(app)
    .patch('/api/v1/user/' + signupData.id)
    .set('Cookie', await global.signin())
    .send({ name: 'mehdi Usul' })
    .expect(200);

  const notUpdatedUser = await User.findById(signupData.id);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  console.log((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

  expect(notUpdatedUser!.email).toBe('mehdi Usul');
});
