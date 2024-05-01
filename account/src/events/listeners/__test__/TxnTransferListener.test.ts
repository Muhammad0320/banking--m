import {
  AccountCurrency,
  TxnTransferCreatedEvent,
  UserRole
} from '@m0banking/common';
import { natsWrapper } from '../../../natswrapper';

import Account from '../../../model/account';
import { User, UserDoc } from '../../../model/user';
import mongoose from 'mongoose';
import { AccountTier } from '../../../enums/AccountTier';
import { AccountType } from '../../../enums/AccountTypeEnum';
import { Message } from 'node-nats-streaming';
import { TxnTransferCreatedListener } from '../TxnTransferCreatedListener';

const userBuilder = async () =>
  await User.buildUser({
    id: new mongoose.Types.ObjectId().toHexString(),
    password: 'shitpassword',

    email: 'shitman@gmail.com' + Math.random(),
    name: 'Lisan al-gaib',
    role: UserRole.User,
    version: 0
  });

const accountBuilder = async (user: UserDoc) =>
  await Account.buildAccount({
    pin: '1234',
    pinConfirm: '1234',

    user,
    tier: AccountTier.Basic,
    currency: AccountCurrency.USD,
    type: AccountType.Current
  });

const setup = async () => {
  const listener = new TxnTransferCreatedListener(natsWrapper.client);

  const user = await userBuilder();
  const account = await accountBuilder(user);

  const userBen = await userBuilder();
  const benAccount = await accountBuilder(userBen);

  const data: TxnTransferCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    account: {
      id: account.id,
      version: account.version + 1,
      balance: 5000
    },

    beneficiary: {
      id: benAccount.id,
      version: benAccount.version + 1,
      balance: 4000
    }
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, data, account, msg, benAccount };
};

it('updates and saves sender account', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedAccount = await Account.findById(data.account.id);

  if (!updatedAccount) throw new Error('Account not found');

  expect(+updatedAccount.balance).toEqual(data.account.balance);
});

it('updates and saves beneficiary account', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedBeneficiary = await Account.findById(data.beneficiary.id);

  if (!updatedBeneficiary) throw new Error('Benebeneficiary not found');

  expect(+updatedBeneficiary.balance).toEqual(data.beneficiary.balance);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
