import mongoose from 'mongoose';
import { User } from '../../../model/user';
import Account from '../../../model/account';
import { natsWrapper } from '../../../natswrapper';
import { AccountTier } from '../../../enums/AccountTier';
import { AccountType } from '../../../enums/AccountTypeEnum';
import { TxnWithdrawalCreatedListener } from '../TxnWithdrawalCreatedListener';

import {
  AccountCurrency,
  TxnWithdrawalCreatedEvent,
  UserRole
} from '@m0banking/common';

const setup = async () => {
  const listener = new TxnWithdrawalCreatedListener(natsWrapper.client);

  const user = await User.buildUser({
    id: new mongoose.Types.ObjectId().toHexString(),
    password: 'shitpassword',

    email: 'shitman@shit.com',
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

  console.log(account, 'from withdrawal test');

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
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedAccount = await Account.findById(data.account.id);

  if (!updatedAccount) throw new Error('Account not found');

  expect(+updatedAccount.balance).toEqual(data.account.balance);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
