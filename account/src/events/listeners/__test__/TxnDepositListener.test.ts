import {
  AccountCurrency,
  TxnDepositCreatedEvent,
  UserRole
} from '@m0banking/common';
import { natsWrapper } from '../../../natswrapper';
import { TxnDepositedListener } from '../TxnDepositCretaedListener';
import Account from '../../../model/account';
import { User } from '../../../model/user';
import mongoose from 'mongoose';
import { AccountTier } from '../../../enums/AccountTier';
import { AccountType } from '../../../enums/AccountTypeEnum';
import { Message } from 'node-nats-streaming';

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
    account: {
      id: account.id,
      version: account.version + 1,
      balance: 5000
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

  expect(updatedAccount?.balance).toEqual(data.account.balance);
});

it(' acks the messge ', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
