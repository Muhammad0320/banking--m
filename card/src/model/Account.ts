import {
  AccountCurrency,
  AccountStatus,
  AccountTier,
  AccountType,
  CryptoManager
} from '@m0banking/common';
import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

type UserObj = {
  id: string;
  name: string;
};

type AccountAttrs = {
  id: string;
  no: number;
  user: UserObj;
  balance: number;
  pin: string;
  tier: AccountTier;
  type: AccountType;
  status: AccountStatus;
  currency: AccountCurrency;
  version: number;
  _block: boolean;
};

export type AccountDoc = mongoose.Document & AccountAttrs;

type AccountModel = mongoose.Model<AccountDoc> & {
  buildAccount(attrs: AccountAttrs): Promise<AccountDoc>;

  findByLastVersionAndId(
    id: string,
    version: number
  ): Promise<AccountDoc | null>;
};

const accountSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: Object.values(AccountType)
    },

    tier: {
      type: String,
      enum: Object.values(AccountTier)
    },

    no: {
      type: Number,
      unique: true
    },

    pin: {
      type: String,
      required: true
    },

    user: {
      id: {
        type: String,
        required: true
      },

      name: {
        type: String,
        required: true
      }
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
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;

        delete ret._id;
      }
    }
  }
);

accountSchema.set('versionKey', 'version');
accountSchema.plugin(updateIfCurrentPlugin);

accountSchema.statics.buildAccount = async function(attrs: AccountAttrs) {
  return await Account.create({ ...attrs, _id: attrs.id });
};

accountSchema.statics.findByLastVersionAndId = async function(
  id: string,
  version: number
) {
  const __v = version - 1;

  await Account.findOne({ _id: id, version: __v });
};

const Account = mongoose.model<AccountDoc, AccountModel>(
  'Account',
  accountSchema
);

export { Account };
