import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns a 401 for unauthenticated access', async () => {
  await request(app)
    .post('/api/v1/txn/card')
    .send()
    .expect(401);
});

it('returns a 400 for invalid card number format', async () => {
  await request(app)
    .post('/api/v1/txn/deposit')
    .send({
      no: 1_234_899_183_918_39,
      cvv: 345,
      expMonth: 11,
      expYear: 2025,
      cardName: 'Lisan Al gaib',
      billingAddress: 'G50, Balogun Gambari compod',
      amount: 500,
      reasin: 'Shit',
      beneficiary: new mongoose.Types.ObjectId().toHexString(),
      account: new mongoose.Types.ObjectId().toHexString()
    })
    .expect(400);

  await request(app)
    .post('/api/v1/txn/deposit')
    .send({
      no: 0,
      cvv: 345,
      expMonth: 11,
      expYear: 2025,
      cardName: 'Lisan Al gaib',
      billingAddress: 'G50, Balogun Gambari compod',
      amount: 500,
      reasin: 'Shit',
      beneficiary: new mongoose.Types.ObjectId().toHexString(),
      account: new mongoose.Types.ObjectId().toHexString()
    })
    .expect(400);
});

it('returns a 401 for invalid cvv  format', async () => {
  await request(app)
    .post('/api/v1/txn/deposit')
    .send({
      no: 1_234_899_183_918_329,
      cvv: 34,
      expMonth: 11,
      expYear: 2025,
      cardName: 'Lisan Al gaib',
      billingAddress: 'G50, Balogun Gambari compod',
      amount: 500,
      reasin: 'Shit',
      beneficiary: new mongoose.Types.ObjectId().toHexString(),
      account: new mongoose.Types.ObjectId().toHexString()
    })
    .expect(400);

  await request(app)
    .post('/api/v1/txn/deposit')
    .send({
      no: 1_234_899_183_918_329,
      cvv: 34323,
      expMonth: 11,
      expYear: 2025,
      cardName: 'Lisan Al gaib',
      billingAddress: 'G50, Balogun Gambari compod',
      amount: 500,
      reasin: 'Shit',
      beneficiary: new mongoose.Types.ObjectId().toHexString(),
      account: new mongoose.Types.ObjectId().toHexString()
    })
    .expect(400);
});
