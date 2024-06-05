import request from 'supertest';
import { app } from '../../app';
import { UserStatus } from '@m0banking/common';
import User from '../../model/user';

it('return status other that 404, to assert the availablility of the route', async () => {
  const response = await request(app)
    .post('/api/v1/user/signin')
    .send({
      email: 'shitman@gmail.com',
      password: 'shitpassword'
    });

  expect(response.statusCode).not.toEqual(404);
});

it('return a 400 on invalid email', async () => {
  await request(app)
    .post('/api/v1/user/signin')
    .send({
      email: 'shitman@gmail.com',
      password: 'shitpassword'
    })
    .expect(400);

  await request(app)
    .post('/api/v1/user/signin')
    .send({
      password: 'shitpassword'
    })
    .expect(400);
});

// it('returns a 400 on incorrect password', async () => {
//   const {
//     body: { data }
//   } = await request(app)
//     .post('/api/v1/user/signup')
//     .send({
//       name: 'shit man',
//       email: 'shitman@gmail.com',
//       password: 'shijgtnjngnrgnr',
//       passwordConfirm: 'shijgtnjngnrgnr',
//       status: UserStatus.Active
//     })
//     .expect(201);

//   await request(app)
//     .post('/api/v1/user/signin')
//     .send({
//       email: data.email
//     })
//     .expect(400);

//   await request(app)
//     .post('/api/v1/user/signin')
//     .send({
//       email: data.email,
//       password: 'shitpassword'
//     })
//     .expect(400);
// });

it('returns a 200 on valid inputs', async () => {
  const {
    body: { data }
  } = await request(app)
    .post('/api/v1/user/signup')
    .send({
      name: 'shit man',
      email: 'shitman@gmail.com',
      password: 'shijgtnjngnrgnr',
      passwordConfirm: 'shijgtnjngnrgnr',
      status: UserStatus.Active
    })
    .expect(201);

  await request(app)
    .post('/api/v1/user/signin')
    .send({
      email: data.email,
      password: 'shijgtnjngnrgnr'
    })
    .expect(200);
});

it('asserts that a cookie was set to the headers', async () => {
  const {
    body: { data }
  } = await request(app)
    .post('/api/v1/user/signup')
    .send({
      name: 'shit man',
      email: 'shitman@gmail.com',
      password: 'shijgtnjngnrgnr',
      passwordConfirm: 'shijgtnjngnrgnr',
      status: UserStatus.Active
    })
    .expect(201);

  const response = await request(app)
    .post('/api/v1/user/signin')
    .send({
      email: data.email,
      password: 'shijgtnjngnrgnr'
    })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});

it('increments signinTimestamps field on every signins', async () => {
  const {
    body: { data }
  } = await request(app)
    .post('/api/v1/user/signup')
    .send({
      name: 'shit man',
      email: 'shitman@gmail.com',
      password: 'shijgtnjngnrgnr',
      passwordConfirm: 'shijgtnjngnrgnr',
      status: UserStatus.Active
    })
    .expect(201);

  // const cookieSignup = response.get('Set-Cookie');

  // await request(app)
  //   .post('/api/v1/user/signout')
  //   .set('Cookie', cookieSignup!)
  //   .send({})
  //   .expect(200);

  console.log(data, 'from signin test');

  const response2 = await request(app)
    .post('/api/v1/user/signin')
    .send({
      email: data.email,
      password: 'shijgtnjngnrgnr'
    })
    .expect(200);

  // const cookie = response2.get('Set-Cookie');

  // if (!cookie) return;

  // await request(app)
  //   .post('/api/v1/user/signout')
  //   .set('Cookie', cookie)
  //   .send({})
  //   .expect(200);

  await request(app)
    .post('/api/v1/user/signin')
    .send({
      email: data.email,
      password: 'shijgtnjngnrgnr'
    })
    .expect(200);

  const usersignins = (await User.findById(data.id))?.signinTimeStamps?.length;

  expect(usersignins).toEqual(2);
});
