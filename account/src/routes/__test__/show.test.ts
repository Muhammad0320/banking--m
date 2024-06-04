import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { UserRole } from '@m0banking/common';
import { AccountCurrency } from '@m0banking/common';
import { AccountTier } from '../../enums/AccountTier';
import { User } from '../../model/user';
import Account from '../../model/account';
import { AccountType } from '../../enums/AccountTypeEnum';

it('returns a 401 on unauthorized user access', async () => {
  const accountId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .get('/api/v1/account/' + accountId)

    .send()
    .expect(401);
});

it('returns a 404, if a user w/ such id does not exist', async () => {
  const accountId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .get('/api/v1/account/' + accountId)
    .set('Cookie', await global.signin())
    .send()
    .expect(404);
});

it('returns a 400, if user passes invalid mongoose id', async () => {
  await request(app)
    .get('/api/v1/account/' + 'accountId')
    .set('Cookie', await global.signin())
    .send()
    .expect(400);
});

it('returns a 403, if user tried to check other users account', async () => {
  // const {
  //   body: { data }
  // } = await request(app)
  //   .post('/api/v1/account')
  //   .set(
  //     'Cookie',
  //     await global.signin(new mongoose.Types.ObjectId().toHexString())
  //   )
  //   .send({
  //     currency: AccountCurrency.NGN,
  //     tier: AccountTier.Basic,
  //     pin: 1234,
  //     pinConfirm: 1234
  //   })
  //   .expect(201);

  // console.log(data, 'from the test');

  const user = await User.buildUser({
    id: new mongoose.Types.ObjectId().toHexString(),
    name: 'Lisan al Gaib',
    password: 'shitword',
    email: 'shit@shit.com',
    role: UserRole.User,
    version: 0
  });

  const account = await Account.buildAccount({
    currency: AccountCurrency.NGN,
    tier: AccountTier.Basic,
    pin: '1234',
    pinConfirm: '1234',
    type: AccountType.Savings,
    user
  });

  if (!!!(await Account.findById(account.id))) throw new Error('shittt');

  await request(app)
    .get('/api/v1/account/' + account.id)
    .set('Cookie', await global.signin())
    .send()
    .expect(403);
});

it('returns a 200, if user is an admin', async () => {
  const {
    body: { data }
  } = await request(app)
    .post('/api/v1/account')
    .set(
      'Cookie',
      await global.signin(new mongoose.Types.ObjectId().toHexString())
    )
    .send({
      currency: AccountCurrency.NGN,
      tier: AccountTier.Basic,
      pin: 1234,
      pinConfirm: 1234
    })
    .expect(201);

  await request(app)
    .get('/api/v1/account/' + data.id)
    .set(
      'Cookie',
      await global.signin(
        new mongoose.Types.ObjectId().toHexString(),
        UserRole.Admin
      )
    )
    .send()
    .expect(200);
});

it('returns a 200, if a user checks his/her own account', async () => {
  const user = await User.buildUser({
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'lisanalgaib@gmail.com',
    name: 'Shit man',
    password: 'shit-password',
    role: UserRole.User,
    version: 0
  });

  const {
    body: { data }
  } = await request(app)
    .post('/api/v1/account')
    .set('Cookie', await global.signin(user.id))
    .send({
      currency: AccountCurrency.NGN,
      tier: AccountTier.Basic,
      pin: 1234,
      pinConfirm: 1234
    })
    .expect(201);

  console.log(data);

  await request(app)
    .get('/api/v1/account/' + data.id)
    .set('Cookie', await global.signin(user.id))
    .send()
    .expect(200);
});
