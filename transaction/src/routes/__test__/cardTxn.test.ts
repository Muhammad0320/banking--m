import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Account, AccountDoc } from '../../model/account';
import {
  AccountCurrency,
  AccountStatus,
  AccountTier,
  AccountType,
  CardNetwork,
  CardStatus,
  CardType,
  CryptoManager
} from '@m0banking/common';
import { Card } from '../../model/card';
import { dateFxns } from '../../service/helper';
import { hashingWork } from '../../service/crypto';

const accountBuilder = async (status?: AccountStatus, balance?: number) => {
  return await Account.buildAccount({
    id: new mongoose.Types.ObjectId().toHexString(),
    no: 9381347599,
    user: {
      id: new mongoose.Types.ObjectId().toHexString(),
      name: 'Lisan al Gaib'
    },
    balance: balance || 5000,
    pin: '1123',
    tier: AccountTier.Basic,
    type: AccountType.Current,
    status: status || AccountStatus.Active,
    currency: AccountCurrency.USD,
    version: 0,
    _block: false
  });
};

type cardDataType = {
  no: string;
  billingAddress: string;
  cvv: string;
  status?: CardStatus;
};

const cardBuilder = async (account: AccountDoc, cardData: cardDataType) => {
  const { yy, mm } = dateFxns();

  return Card.buildCard({
    id: new mongoose.Types.ObjectId().toHexString(),
    account,
    user: {
      id: account.user.id,
      name: account.user.name
    },
    settings: {
      dailyLimit: 50,
      weeklyLimit: 500,
      monthlyLimit: 5000
    },

    info: {
      no: cardData.no,
      network: CardNetwork.Visa,
      status: cardData.status || CardStatus.Active,
      type: CardType.Debit,
      cvv: cardData.cvv,
      expiryDate: new Date(yy, mm),
      issueDate: new Date(),

      billingAddress: cardData.billingAddress,
      maxCredit: undefined // for now sha
    },
    version: 0
  });
};

it('returns a 401 for unauthenticated access', async () => {
  await request(app)
    .post('/api/v1/txn/card')
    .send()
    .expect(401);
});

it('returns a 400 for invalid card number format', async () => {
  await request(app)
    .post('/api/v1/txn/card')
    .set('Cookie', await global.signin())

    .send({
      no: 1_234_899_183_918_39,
      cvv: 345,
      expMonth: 11,
      expYear: 2025,
      cardName: 'Lisan Al gaib',
      billingAddress: 'G50, Balogun Gambari compod',
      amount: 500,
      reason: 'Shit',
      beneficiary: new mongoose.Types.ObjectId().toHexString(),
      account: new mongoose.Types.ObjectId().toHexString()
    })
    .expect(400);

  await request(app)
    .post('/api/v1/txn/card')
    .set('Cookie', await global.signin())
    .send({
      no: 0,
      cvv: 345,
      expMonth: 11,
      expYear: 2025,
      cardName: 'Lisan Al gaib',
      billingAddress: 'G50, Balogun Gambari compod',
      amount: 500,
      reason: 'Shit',
      beneficiary: new mongoose.Types.ObjectId().toHexString(),
      account: new mongoose.Types.ObjectId().toHexString()
    })
    .expect(400);
});

it('returns a 400 for invalid cvv  format', async () => {
  await request(app)
    .post('/api/v1/txn/card')
    .set('Cookie', await global.signin())
    .send({
      no: 1_234_899_183_918_329,
      cvv: 34,
      expMonth: 11,
      expYear: 2025,
      cardName: 'Lisan Al gaib',
      billingAddress: 'G50, Balogun Gambari compod',
      amount: 500,
      reason: 'Shit',
      beneficiary: new mongoose.Types.ObjectId().toHexString(),
      account: new mongoose.Types.ObjectId().toHexString()
    })
    .expect(400);

  await request(app)
    .post('/api/v1/txn/card')
    .set('Cookie', await global.signin())
    .send({
      no: 1_234_899_183_918_329,
      cvv: 34323,
      expMonth: 11,
      expYear: 2025,
      cardName: 'Lisan Al gaib',
      billingAddress: 'G50, Balogun Gambari compod',
      amount: 500,
      reason: 'Shit',
      beneficiary: new mongoose.Types.ObjectId().toHexString(),
      account: new mongoose.Types.ObjectId().toHexString()
    })
    .expect(400);
});

it('returns a 400 for invalid expiry date format', async () => {
  await request(app)
    .post('/api/v1/txn/card')
    .set('Cookie', await global.signin())
    .send({
      no: 1_234_899_183_918_329,
      cvv: 343,
      expMonth: 20,
      expYear: 2025,
      cardName: 'Lisan Al gaib',
      billingAddress: 'G50, Balogun Gambari compod',
      amount: 500,
      reason: 'Shit',
      beneficiary: new mongoose.Types.ObjectId().toHexString(),
      account: new mongoose.Types.ObjectId().toHexString()
    })
    .expect(400);

  await request(app)
    .post('/api/v1/txn/card')
    .set('Cookie', await global.signin())
    .send({
      no: 1_234_899_183_918_329,
      cvv: 343,
      expMonth: 2,
      expYear: 2060,
      cardName: 'Lisan Al gaib',
      billingAddress: 'G50, Balogun Gambari compod',
      amount: 500,
      reason: 'Shit',
      beneficiary: new mongoose.Types.ObjectId().toHexString(),
      account: new mongoose.Types.ObjectId().toHexString()
    })
    .expect(400);

  await request(app)
    .post('/api/v1/txn/card')
    .set('Cookie', await global.signin())
    .send({
      no: 1_234_899_183_918_329,
      cvv: 343,
      expMonth: 3,
      expYear: 2024,
      cardName: 'Lisan Al gaib',
      billingAddress: 'G50, Balogun Gambari compod',
      amount: 500,
      reason: 'Shit',
      beneficiary: new mongoose.Types.ObjectId().toHexString(),
      account: new mongoose.Types.ObjectId().toHexString()
    })
    .expect(400);
});

it('returns a 400 for invalid cardName format ', async () => {
  await request(app)
    .post('/api/v1/txn/card')
    .set('Cookie', await global.signin())
    .send({
      no: 1_234_899_183_918_329,
      cvv: 343,
      expMonth: 11,
      expYear: 2026,
      cardName: 'shit',
      billingAddress: 'G50, Balogun Gambari compod',
      amount: 500,
      reason: 'Shit',
      beneficiary: new mongoose.Types.ObjectId().toHexString(),
      account: new mongoose.Types.ObjectId().toHexString()
    })
    .expect(400);

  await request(app)
    .post('/api/v1/txn/card')
    .set('Cookie', await global.signin())
    .send({
      no: 1_234_899_183_918_329,
      cvv: 343,
      expMonth: 11,
      expYear: 2026,
      cardName: '',
      billingAddress: 'G50, Balogun Gambari compod',
      amount: 500,
      reason: 'Shit',
      beneficiary: new mongoose.Types.ObjectId().toHexString(),
      account: new mongoose.Types.ObjectId().toHexString()
    })
    .expect(400);
});

it('returns a 400 if the provides account are not of valid format ', async () => {
  await request(app)
    .post('/api/v1/txn/card')
    .set('Cookie', await global.signin())

    .send({
      no: 1_234_899_183_918_329,
      cvv: 343,
      expMonth: 11,
      expYear: 2026,
      cardName: 'Lisan al Gaib',
      billingAddress: 'G50, Balogun Gambari compod',
      amount: 500,
      reason: 'Shit',
      beneficiary: 'shit id',
      account: new mongoose.Types.ObjectId().toHexString()
    })
    .expect(400);

  await request(app)
    .post('/api/v1/txn/card')
    .set('Cookie', await global.signin())
    .send({
      no: 1_234_899_183_918_329,
      cvv: 343,
      expMonth: 11,
      expYear: 2026,
      cardName: 'Lisan al Gaib',
      billingAddress: 'G50, Balogun Gambari compod',
      amount: 500,
      reason: 'Shit',
      beneficiary: new mongoose.Types.ObjectId().toHexString(),
      account: 'shit id'
    })
    .expect(400);
});

it('returns a 403 if a user tried to transact with another users card', async () => {
  const unhashedNo = '1234899183918329';
  const unhashedcvv = '123';

  const hashedNo = await CryptoManager.hash(unhashedNo);

  const hashedcvv = await CryptoManager.hash(unhashedcvv);

  const cardData: cardDataType = {
    no: hashedNo,
    cvv: hashedcvv,
    billingAddress: 'G50, Balogun Gambari compound'
  };

  const account = await accountBuilder(AccountStatus.Active, 5000);
  const beneficiaryAccount = await accountBuilder(AccountStatus.Active, 50);

  const card = await cardBuilder(account, cardData);

  await request(app)
    .post('/api/v1/txn/card')
    .set('Cookie', await global.signin(account.user.id))
    .send({
      no: +unhashedNo,
      cvv: +unhashedcvv,
      expMonth: card.info.expiryDate.getMonth() + 1,
      expYear: card.info.expiryDate.getFullYear(),
      cardName: card.user.name,
      billingAddress: card.info.billingAddress,
      amount: 50,
      reason: 'Shit',
      beneficiary: beneficiaryAccount.id,
      account: account.id
    })
    .expect(403);
});

it('returns a 400 on invalid credentials ', async () => {
  const unhashedNo = '1234899183918329';
  const unhashedcvv = '123';

  const hashedNo = await CryptoManager.hash(unhashedNo);

  const hashedcvv = await CryptoManager.hash(unhashedcvv);

  const cardData: cardDataType = {
    no: hashedNo,
    cvv: hashedcvv,
    billingAddress: 'G50, Balogun Gambari compound'
  };

  const account = await accountBuilder(AccountStatus.Active, 5000);
  const beneficiaryAccount = await accountBuilder(AccountStatus.Active, 50);

  const card = await cardBuilder(account, cardData);

  await request(app)
    .post('/api/v1/txn/card')
    .set('Cookie', await global.signin(account.user.id))
    .send({
      no: +unhashedNo,
      cvv: +unhashedcvv,
      expMonth: card.info.expiryDate.getMonth() + 1,
      expYear: card.info.expiryDate.getFullYear(),
      cardName: card.user.name,
      billingAddress: 'G50',
      amount: 50,
      reason: 'Shit',
      beneficiary: beneficiaryAccount.id,
      account: account.id
    })
    .expect(400);

  await request(app)
    .post('/api/v1/txn/card')
    .set('Cookie', await global.signin(account.user.id))
    .send({
      no: +unhashedNo,
      cvv: 123,
      expMonth: card.info.expiryDate.getMonth() + 1,
      expYear: card.info.expiryDate.getFullYear(),
      cardName: card.user.name,
      billingAddress: card.info.billingAddress,
      amount: 50,
      reason: 'Shit',
      beneficiary: beneficiaryAccount.id,
      account: account.id
    })
    .expect(400);

  await request(app)
    .post('/api/v1/txn/card')
    .set('Cookie', await global.signin(account.user.id))
    .send({
      no: +unhashedNo,
      cvv: +unhashedcvv,
      expMonth: card.info.expiryDate.getMonth() + 1,
      expYear: card.info.expiryDate.getFullYear(),
      cardName: 'Muhammad Awwal',
      billingAddress: card.info.billingAddress,
      amount: 50,
      reason: 'Shit',
      beneficiary: beneficiaryAccount.id,
      account: account.id
    })
    .expect(400);

  await request(app)
    .post('/api/v1/txn/card')
    .set('Cookie', await global.signin(account.user.id))
    .send({
      no: +unhashedNo,
      cvv: +unhashedcvv,
      expMonth: 1,
      expYear: 2025,
      cardName: 'Muhammad Awwal',
      billingAddress: card.info.billingAddress,
      amount: 50,
      reason: 'Shit',
      beneficiary: beneficiaryAccount.id,
      account: account.id
    })
    .expect(400);
});

it('returns a 404  for unmatched accounts', async () => {
  const unhashedNo = '1234899183918329';
  const unhashedcvv = '123';

  const hashedNo = await CryptoManager.hash(unhashedNo);

  const hashedcvv = await CryptoManager.hash(unhashedcvv);

  const cardData: cardDataType = {
    no: hashedNo,
    cvv: hashedcvv,
    billingAddress: 'G50, Balogun Gambari compound'
  };

  const account = await accountBuilder(AccountStatus.Active, 5000);
  const beneficiaryAccount = await accountBuilder(AccountStatus.Active, 50);

  const card = await cardBuilder(account, cardData);

  await request(app)
    .post('/api/v1/txn/card')
    .set('Cookie', await global.signin(account.user.id))
    .send({
      no: +unhashedNo,
      cvv: +unhashedcvv,
      expMonth: card.info.expiryDate.getMonth() + 1,
      expYear: card.info.expiryDate.getFullYear(),
      cardName: card.user.name,
      billingAddress: card.info.billingAddress,
      amount: 50,
      reason: 'Shit',
      beneficiary: new mongoose.Types.ObjectId().toHexString(),
      account: account.id
    })
    .expect(404);

  await request(app)
    .post('/api/v1/txn/card')
    .set('Cookie', await global.signin(account.user.id))
    .send({
      no: +unhashedNo,
      cvv: +unhashedcvv,
      expMonth: card.info.expiryDate.getMonth() + 1,
      expYear: card.info.expiryDate.getFullYear(),
      cardName: card.user.name,
      billingAddress: card.info.billingAddress,
      amount: 50,
      reason: 'Shit',
      beneficiary: beneficiaryAccount.id,
      account: new mongoose.Types.ObjectId().toHexString()
    })
    .expect(404);
});

it('returns 400 if beneficiary account is inactive', async () => {
  const unhashedNo = '1234899183918329';
  const unhashedcvv = '123';

  const hashedNo = await CryptoManager.hash(unhashedNo);

  const hashedcvv = await CryptoManager.hash(unhashedcvv);

  const cardData: cardDataType = {
    no: hashedNo,
    cvv: hashedcvv,
    billingAddress: 'G50, Balogun Gambari compound'
  };

  const account = await accountBuilder(AccountStatus.Active, 5000);
  const beneficiaryAccount = await accountBuilder(AccountStatus.Blocked, 50);

  const card = await cardBuilder(account, cardData);

  await request(app)
    .post('/api/v1/txn/card')
    .set('Cookie', await global.signin(account.user.id))
    .send({
      no: +unhashedNo,
      cvv: +unhashedcvv,
      expMonth: card.info.expiryDate.getMonth() + 1,
      expYear: card.info.expiryDate.getFullYear(),
      cardName: card.user.name,
      billingAddress: card.info.billingAddress,
      amount: 50,
      reason: 'Shit',
      beneficiary: beneficiaryAccount.id,
      account: account.id
    })
    .expect(400);
});

it('returns a 400 for expired or inactive card', async () => {
  const unhashedNo = '1234899183918329';
  const unhashedcvv = '123';

  const hashedNo = await CryptoManager.hash(unhashedNo);

  const hashedcvv = await CryptoManager.hash(unhashedcvv);

  const cardData: cardDataType = {
    no: hashedNo,
    cvv: hashedcvv,
    billingAddress: 'G50, Balogun Gambari compound',
    status: CardStatus.Expired
  };

  const account = await accountBuilder(AccountStatus.Active, 5000);
  const beneficiaryAccount = await accountBuilder(AccountStatus.Active, 50);

  const card = await cardBuilder(account, cardData);

  await request(app)
    .post('/api/v1/txn/card')
    .set('Cookie', await global.signin(account.user.id))
    .send({
      no: +unhashedNo,
      cvv: +unhashedcvv,
      expMonth: card.info.expiryDate.getMonth() + 1,
      expYear: card.info.expiryDate.getFullYear(),
      cardName: card.user.name,
      billingAddress: card.info.billingAddress,
      amount: 50,
      reason: 'Shit',
      beneficiary: beneficiaryAccount.id,
      account: account.id
    })
    .expect(400);
});

it('returns a 400 for insufficient fund', async () => {
  const unhashedNo = '1234899183918329';
  const unhashedcvv = '123';

  const hashedNo = await CryptoManager.hash(unhashedNo);

  const hashedcvv = await CryptoManager.hash(unhashedcvv);

  const cardData: cardDataType = {
    no: hashedNo,
    cvv: hashedcvv,
    billingAddress: 'G50, Balogun Gambari compound'
  };

  const account = await accountBuilder(AccountStatus.Active, 50);
  const beneficiaryAccount = await accountBuilder(AccountStatus.Active, 50);

  const card = await cardBuilder(account, cardData);

  await request(app)
    .post('/api/v1/txn/card')
    .set('Cookie', await global.signin(account.user.id))
    .send({
      no: +unhashedNo,
      cvv: +unhashedcvv,
      expMonth: card.info.expiryDate.getMonth() + 1,
      expYear: card.info.expiryDate.getFullYear(),
      cardName: card.user.name,
      billingAddress: card.info.billingAddress,
      amount: 500,
      reason: 'Shit',
      beneficiary: beneficiaryAccount.id,
      account: account.id
    })
    .expect(400);
});

it('returns a 200 when everything is valid', async () => {
  const unhashedNo = '1234899183918329';
  const unhashedcvv = '123';

  const hashedNo = await CryptoManager.hash(unhashedNo);

  const hashedcvv = await CryptoManager.hash(unhashedcvv);

  const cardData: cardDataType = {
    no: hashedNo,
    cvv: hashedcvv,
    billingAddress: 'G50, Balogun Gambari compound'
  };

  const account = await accountBuilder(AccountStatus.Active, 50000);
  const beneficiaryAccount = await accountBuilder(AccountStatus.Active, 50);

  const card = await cardBuilder(account, cardData);

  await request(app)
    .post('/api/v1/txn/card')
    .set('Cookie', await global.signin(account.user.id))
    .send({
      no: +unhashedNo,
      cvv: +unhashedcvv,
      expMonth: card.info.expiryDate.getMonth() + 1,
      expYear: card.info.expiryDate.getFullYear(),
      cardName: card.user.name,
      billingAddress: card.info.billingAddress,
      amount: 500,
      reason: 'Shit',
      beneficiary: beneficiaryAccount.id,
      account: account.id
    })
    .expect(200);
});
