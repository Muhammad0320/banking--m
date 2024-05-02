import mongoose from 'mongoose';
import { UserDoc } from './user';
import { AccountTier } from '../enums/AccountTier';
import { AccountType } from '../enums/AccountTypeEnum';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { generateTenDigitInt } from '../services/generateAccountNumber';
import {
  AccountStatus,
  CryptoManager,
  AccountCurrency
} from '@m0banking/common';

type AccountAttrs = {
  pin: string;

  pinConfirm: string;

  //  dob: string;

  balance?: number;

  user: UserDoc;

  tier: AccountTier;

  type: AccountType;

  currency: AccountCurrency;
};

type AccountDoc = mongoose.Document &
  AccountAttrs & {
    version: number;
    status: AccountStatus;
    balance: number;
    no: number;
    _block: boolean;
  };

type AccountModel = mongoose.Model<AccountDoc> & {
  buildAccount(attrs: AccountAttrs): Promise<AccountDoc>;

  findByLastVersionAndId(
    id: string,
    version: number
  ): Promise<AccountDoc | null>;
};

const accountSchema = new mongoose.Schema(
  {
    balance: {
      type: Number,

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

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
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

accountSchema.set('versionKey', 'version');
accountSchema.plugin(updateIfCurrentPlugin);

accountSchema.statics.buildAccount = async (attrs: AccountAttrs) => {
  return await Account.create(attrs);
};

accountSchema.statics.findByLastVersionAndId = async function(
  id: string,
  version: number
) {
  const __v = version - 1;

  return await Account.findOne({ _id: id, version: __v });
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

  console.log(this._block, 'from the find one and update it self');

  next();
});

accountSchema.pre(/^findOne/, function(this: any, next) {
  console.log(this.getQuery(), 'from the new getquery it self');

  console.log(this._block, 'from the new // find regex');

  !!this._block
    ? this.find({ status: { $ne: AccountStatus.Blocked } })
    : this.find();

  next();
});

accountSchema.pre(/^find/, function(this: any, next) {
  console.log(
    this.getQuery(),
    'from the new getquery it self wild card irself '
  );

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

accountSchema.pre('find', function(next) {
  console.log(this.getQuery(), 'from the new pre find');

  next();
});

const Account = mongoose.model<AccountDoc, AccountModel>(
  'Account',
  accountSchema
);

export default Account;
