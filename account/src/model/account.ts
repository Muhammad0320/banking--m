import mongoose from 'mongoose';
import { AccountStatus } from '../enums/AccountStatusEnum';
import { AccountType } from '../enums/AccountTypeEnum';
import { AccountCurrency } from '../enums/AccountCurrencyEnum';
import { AccountTier } from '../enums/AccountTier';

type AccountAttrs = {
  pin: number;

  //  dob: string;

  userId: string;

  tier: AccountTier;

  type: AccountType;

  currency: AccountCurrency;
};

type AccountDoc = mongoose.Document &
  AccountAttrs & { version: number; status: AccountStatus; balace: number };

type AccountModel = mongoose.Model<AccountDoc> & {
  buildAccount(attrs: AccountAttrs): Promise<AccountDoc>;
};

const accountSchema = new mongoose.Schema({
  balance: {
    type: String,

    default: 0
  },

  status: {
    type: String,

    default: AccountStatus.Active,

    enum: Object.values(AccountStatus)
  },

  tier: {
    type: String,
    required: true,
    enum: Object.values(AccountTier)
  },

  type: {
    type: String,

    enum: Object.values(AccountType),
    default: AccountType.Savings
  },

  currency: {
    type: String,
    required: true,
    enum: Object.values(AccountCurrency)
  },

  userId: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,

    default: new Date()
  }
});

accountSchema.statics.buildAccount = async (attrs: AccountAttrs) => {
  return await Account.create(attrs);
};

const Account = mongoose.model<AccountDoc, AccountModel>(
  'Account',
  accountSchema
);

export default Account;
