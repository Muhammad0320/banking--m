import mongoose from 'mongoose';
import { AccountCurrency, AccountStatus } from '@m0banking/common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

type AccountAttrs = {
  id: string;
  userId: string;
  balance: number;
  version: number;
  _block: boolean;
  status: AccountStatus;
  currency: AccountCurrency;
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
