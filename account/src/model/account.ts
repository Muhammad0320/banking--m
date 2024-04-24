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
    _block: boolean;
  };

type AccountModel = mongoose.Model<AccountDoc> & {
  buildAccount(attrs: AccountAttrs): Promise<AccountDoc>;
};

const accountSchema = new mongoose.Schema(
  {
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

    no: Number,

    _block: {
      type: Boolean,
      default: false
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

accountSchema.statics.buildAccount = async (attrs: AccountAttrs) => {
  return await Account.create(attrs);
};

accountSchema.pre('save', async function(next) {
  if (!this.isNew) return next();

  this.pin = await CryptoManager.hash(this.pin);
  this.no = generateTenDigitInt();

  console.log(this._block, 'from pre save hook');

  this.pinConfirm = undefined;
});

accountSchema.pre('findOneAndUpdate', function(this: any, next) {
  const update = this.getUpdate();

  // from Conner Ardman

  this._block = update && update.status === AccountStatus.Blocked;

  // if (update && update.status === AccountStatus.Blocked) {
  //   this._block = true;

  //   this.set({ _block: true });
  // }

  console.log(this._block, 'from the find one and update it self');

  next();
});

// accountSchema.pre<AccountDoc>('findOneAndUpdate', async function(next) {
//   // @ts-ignore
//   const update = this.getUpdate();

//   // from Conner Ardman
//   if (update && update.status === AccountStatus.Blocked) {
//     this._block = true;
//     // @ts-ignore
//     this.set({ _block: true })
//     await this.save();
//   }

//   console.log(this._block, 'from the find one and update it self');

//   next();
// });

accountSchema.pre(/^findOne/, function(this: any, next) {
  console.log(this._block, 'from the new // find regex');

  !!this._block
    ? this.find({ status: { $ne: AccountStatus.Blocked } })
    : this.find();

  next();
});

// accountSchema.pre('findOneAndUpdate', function(this: any, next) {
//   const update = this.getUpdate();

//   // Set _block field in the document
//   if (update && update.status === AccountStatus.Blocked) {
//     this._block = true;
//   }

//   console.log(this._block, 'from the find one and update itself');

//   next();
// });

// accountSchema.pre(/^find/, function(this: any, next) {
//   console.log(this._block, 'from the new find regex');

//   // Filter out blocked users based on _block field
//   if (this._block === undefined || this._block === false) {
//     this.where({ status: { $ne: AccountStatus.Blocked } });
//   }

//   next();
// });

const Account = mongoose.model<AccountDoc, AccountModel>(
  'Account',
  accountSchema
);

export default Account;
