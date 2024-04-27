import { AccountCurrency, AccountStatus } from '@m0banking/common';
import mongoose from 'mongoose';

type AccountAttrs = {
  id: string;
  no: number;
  userId: string;
  balance: number;
  pin: string;
  // tier: string;
  status: AccountStatus;
  currency: AccountCurrency;
  version: number;
  _block: boolean;
};

type AccountDoc = mongoose.Document & AccountAttrs;

type AccountModel = mongoose.Model<AccountDoc> & {
  buildAccount(attrs: AccountAttrs): Promise<AccountDoc>;
};

const AccountSchema = new mongoose.Schema<AccountDoc, AccountModel>({
  no: {
    type: Number,
    unique: true
  },

  userId: {
    type: String,
    unique: true,
    required: true
  },

  currency: {
    type: String,
    enum: Object.values(AccountCurrency),
    default: AccountCurrency.USD
  },

  status: {
    type: String,
    enum: Object.values(AccountStatus),
    default: AccountStatus.Active
  },

  _block: {
    type: Boolean,
    default: false
  },

  balance: {
    type: Number,
    default: 0
  }
});
