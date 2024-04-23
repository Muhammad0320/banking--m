import mongoose from 'mongoose';

import { AccountStatus } from '../enums/AccountStatusEnum';
import { AccountType } from '../enums/AccountTypeEnum';
import { AccountTier } from '../enums/AccountTier';
import { CryptoManager } from '@m0banking/common';
import { AccountCurrency } from '../enums/AccountCurrencyEnum';
import { generateTenDigitInt } from '../services/generateAccountNumber';

type AccountAttrs = {
  pin: string;

  pinConfirm: string;

  //  dob: string;

  userId: string;

  tier: AccountTier;

  type: AccountType;

  currency: AccountCurrency;
};

type AccountDoc = mongoose.Document &
  AccountAttrs & {
    version: number;
    status: AccountStatus;
    balace: number;
    no: number;
  };

type AccountModel = mongoose.Model<AccountDoc> & {
  buildAccount(attrs: AccountAttrs): Promise<AccountDoc>;
};

const accountSchema = new mongoose.Schema({
  balance: {
    type: String,

    default: 0
  },

  pin: {
    type: String,
    required: true,
    select: false
  },

  pinConfirm: {
    type: String,
    validate: {
      validator: function(this: AccountDoc, val: string): boolean {
        return this.pin === val;
      },

      message: 'Pins are not the same'
    }
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
  },

  no: Number
});

accountSchema.statics.buildAccount = async (attrs: AccountAttrs) => {
  return await Account.create(attrs);
};

accountSchema.pre('save', async function(next) {
  if (!this.isNew) return next();

  this.pin = await CryptoManager.hash(this.pin);
  this.no = generateTenDigitInt();

  this.pinConfirm = undefined;
  console.log(' I can see my self invoked');
});

// @ts-ignore
accountSchema.pre(/^find/, async function(
  this: AccountDoc & AccountModel,
  next
) {
  console.log(this.getChanges, 'ehn yesss');

  if (this.getChanges().status === AccountStatus.Blocked) {
    console.log('shit day');
    this.find({ status: { $ne: AccountStatus.Blocked } });
  } else {
    console.log('shit day 2');

    this.find();
  }

  next();
});

const Account = mongoose.model<AccountDoc, AccountModel>(
  'Account',
  accountSchema
);

export default Account;
