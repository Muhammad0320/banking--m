import mongoose from 'mongoose';
import Account from '../account';
import { User } from '../user';
import { AccountCurrency, UserRole } from '@m0banking/common';
import { AccountTier } from '../../enums/AccountTier';
import { AccountType } from '../../enums/AccountTypeEnum';

it('implements occ', async () => {
  const user = await User.buildUser({
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'shit@gmail.com',
    name: 'Shit man',
    password: 'hfvfvvfbvfivfbi',
    version: 0,
    role: UserRole.User
  });

  const account = await Account.buildAccount({
    currency: AccountCurrency.NGN,
    tier: AccountTier.Basic,
    pin: '1234',
    pinConfirm: '1234',
    user,
    type: AccountType.Current
  });

  const accountInstance1 = await Account.findById(account.id);
  const accountInstanc2 = await Account.findById(account.id);

  accountInstance1?.set({ name: 'shit shit' });
  accountInstanc2?.set({ name: 'shit yeah' });

  await accountInstance1?.save();

  try {
    await accountInstanc2?.save();
  } catch (error) {
    return;
  }

  throw new Error('You coude must not reach this point');
});

it('automatically incrememnts version number', async () => {
  const user = await User.buildUser({
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'shit@gmail.com',
    name: 'Shit man',
    password: 'hfvfvvfbvfivfbi',
    version: 0,
    role: UserRole.User
  });

  const account = await Account.buildAccount({
    currency: AccountCurrency.NGN,
    tier: AccountTier.Basic,
    pin: '1234',
    pinConfirm: '1234',
    user,
    type: AccountType.Current
  });

  expect(account.version).toEqual(0);

  const updatedAccount = account.set({ name: 'Carl' });

  await updatedAccount.save();

  expect(account.version).toEqual(1);

  await updatedAccount.save();

  expect(account.version).toEqual(2);

  await updatedAccount.save();

  expect(account.version).toEqual(3);
});
