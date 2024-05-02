import {
  AccountCurrency,
  TxnDepositCreatedEvent,
  UserRole
} from '@m0banking/common';
import mongoose from 'mongoose';
import { User } from '../../../model/user';
import Account from '../../../model/account';
import { Message } from 'node-nats-streaming';
import { natsWrapper } from '../../../natswrapper';
import { AccountTier } from '../../../enums/AccountTier';
import { AccountType } from '../../../enums/AccountTypeEnum';
import { TxnDepositedListener } from '../TxnDepositCretaedListener';

const setup = async () => {
  const listener = new TxnDepositedListener(natsWrapper.client);

  const user = await User.buildUser({
    id: new mongoose.Types.ObjectId().toHexString(),
    password: 'shitpassword',

    email: 'shitman@gmail.com',
    name: 'Lisan al-gaib',
    role: UserRole.User,
    version: 0
  });

  const amount = 500;

  const account = await Account.buildAccount({
    pin: '1234',
    pinConfirm: '1234',

    user,
    tier: AccountTier.Basic,
    currency: AccountCurrency.USD,
    type: AccountType.Current
  });

  const data: TxnDepositCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: account.user.id,
    amount,
    account: {
      id: account.id,
      version: account.version + 1,
      balance: account.balance + amount
    }
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, data, account, msg };
};

it('updates and saved the account', async () => {
  const { listener, data, account, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedAccount = await Account.findById(account.id);

  if (!updatedAccount) throw new Error('Account not fucking found');

  expect(+updatedAccount.balance).toEqual(account.balance + data.amount);
});

it(' acks the message ', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
