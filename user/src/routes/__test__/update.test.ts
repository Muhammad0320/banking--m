import mongoose from 'mongoose';
import { app } from '../../app';
import request from 'supertest';
import User from '../../model/user';
import { natsWrapper } from '../../natswrapper';
import { UserRole } from '@m0banking/common';

it('returs a 404 on invalid id', async () => {
  await request(app)
    .patch('/api/v1/user/' + new mongoose.Types.ObjectId().toString('hex'))
    .set('Cookie', await global.signin(UserRole.User))
    .send({ email: 'njvvfnjnvnjv' })
    .expect(400);
});

it('returns a 400 on invalid email', async () => {
  const response = await request(app)
    .post('/api/v1/user/signup')
    .send({
      name: 'Lisan Al-gaib',
      email: 'shitman@gmail.com',
      password: 'shijgtnjngnrgnr',
      passwordConfirm: 'shijgtnjngnrgnr'
    })
    .expect(201);

  const cookie = response.get('Set-Cookie');

  const signupData = response.body.data;

  if (!cookie) return;

  await request(app)
    .patch('/api/v1/user/' + signupData.id)
    .set('Cookie', cookie)
    .send({ email: 'njvvfnjnvnjv' })
    .expect(400);

  const notUpdatedUser = await User.findById(signupData.id);

  expect(notUpdatedUser!.email).toEqual('shitman@gmail.com');
});

it('returns a 400 in invalid name', async () => {
  const response = await request(app)
    .post('/api/v1/user/signup')
    .send({
      name: 'Lisan Al-gaib',
      email: 'shitman@gmail.com',
      password: 'shijgtnjngnrgnr',
      passwordConfirm: 'shijgtnjngnrgnr'
    })
    .expect(201);

  const cookie = response.get('Set-Cookie');

  const signupData = response.body.data;

  if (!cookie) return;

  await request(app)
    .patch('/api/v1/user/' + signupData.id)
    .set('Cookie', cookie)
    .send({ name: '' })
    .expect(400);

  const notUpdatedUser = await User.findById(signupData.id);

  expect(notUpdatedUser!.name).toEqual('Lisan Al-gaib');
});

it('returns a 403, if a user tries to update another user account ', async () => {
  const {
    body: { data }
  } = await request(app)
    .post('/api/v1/user/signup')
    .send({
      name: 'shit man403',
      email: 'shitman3@gmail.com',
      password: 'shijgtnjngnrgnr',
      passwordConfirm: 'shijgtnjngnrgnr'
    })
    .expect(201);

  await request(app)
    .patch('/api/v1/user/' + data.id)
    .set('Cookie', await global.signin(UserRole.User))
    .send({ name: 'mehdi Usul' })
    .expect(403);
});

it('returns a 200 on valid name', async () => {
  const response = await request(app)
    .post('/api/v1/user/signup')
    .send({
      name: 'shit man3',
      email: 'shitma@gmail.com',
      password: 'shijgtnjngnrgnr',
      passwordConfirm: 'shijgtnjngnrgnr'
    })
    .expect(201);

  const cookie = response.get('Set-Cookie');

  const signupData = response.body.data;

  if (!cookie) return;

  await request(app)
    .patch('/api/v1/user/' + signupData.id)
    .set('Cookie', cookie)
    .send({ name: 'mehdi Usul' })
    .expect(200);

  const notUpdatedUser = await User.findById(signupData.id);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  console.log((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

  expect(notUpdatedUser!.name).toEqual('mehdi Usul');
});

it('returns a 200 if admin tried to update users data', async () => {
  const {
    body: { data }
  } = await request(app)
    .post('/api/v1/user/signup')
    .send({
      name: 'shit man3',
      email: 'shitmanuser@gmail.com',
      password: 'shijgtnjngnrgnr',
      passwordConfirm: 'shijgtnjngnrgnr'
    })
    .expect(201);

  await request(app)
    .patch('/api/v1/user/' + data.id)
    .set('Cookie', await global.signin(UserRole.Admin))
    .send({
      name: 'mehdi Usul',
      email: 'shitman2@gmail.com',
      avatar: 'shitvatar.png'
    })
    .expect(200);
});

it('returns a 200 on valid inputs', async () => {
  const response = await request(app)
    .post('/api/v1/user/signup')
    .send({
      name: 'shit man3',
      email: 'shitman@gmail.com',
      password: 'shijgtnjngnrgnr',
      passwordConfirm: 'shijgtnjngnrgnr'
    })
    .expect(201);

  const cookie = response.get('Set-Cookie');

  const signupData = response.body.data;

  if (!cookie) return;

  await request(app)
    .patch('/api/v1/user/' + signupData.id)
    .set('Cookie', cookie)
    .send({
      name: 'mehdi Usul',
      email: 'shitman2@gmail.com',
      avatar: 'shitvatar.png'
    })
    .expect(200);

  const notUpdatedUser = await User.findById(signupData.id);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  console.log((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

  expect(notUpdatedUser!.name).toEqual('mehdi Usul');
  expect(notUpdatedUser!.avatar).toEqual('shitvatar.png');
});
