import mongoose from 'mongoose';
import { User } from '../../../model/user';
import { natsWrapper } from '../../../natswrapper';
import { TxnWithdrawalCreatedListener } from '../TxnWithdrawalCreatedListener';
import {
  AccountCurrency,
  TxnWithdrawalCreatedEvent,
  UserRole
} from '@m0banking/common';
import { AccountTier } from '../../../enums/AccountTier';
import { AccountType } from '../../../enums/AccountTypeEnum';
import Account from '../../../model/account';

const setup = async () => {
  const listener = new TxnWithdrawalCreatedListener(natsWrapper.client);

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

  const data: TxnWithdrawalCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    account: {
      id: account.id,
      version: account.version + 1,
      balance: 50
    }
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, data, account, msg };
};

it('updates and saves the account', async () => {
  const { listener, data, account, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedAccount = await Account.findById(account.id);

  expect(updatedAccount?.balace).toEqual(data.account.balance);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
