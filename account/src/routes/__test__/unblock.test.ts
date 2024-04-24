import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { UserRole } from '@m0banking/common';
import { AccountCurrency } from '../../enums/AccountCurrencyEnum';
import { AccountTier } from '../../enums/AccountTier';

it('returns a 400  for invalid mongoose  id', async () => {
  await request(app)
    .post('/api/v1/account/unblock/' + 'shitid')
    .set('Cookie', await global.signin())
    .send()
    .expect(400);
});

it('returns a 401, for unauthorized user', async () => {
  await request(app)
    .post(
      '/api/v1/account/block/' + new mongoose.Types.ObjectId().toHexString()
    )

    .send()
    .expect(401);
});
