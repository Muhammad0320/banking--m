import mongoose from 'mongoose';

import { TxnTypeEnum } from '../enums/TxnTypeEnum';
import { TxnStatusEnum } from '../enums/TxnStatusEnum';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

type TxnAttrs = {
  account: string;
  amount: number;
  status: TxnStatusEnum;
  type: TxnTypeEnum;
  beneficiary?: string;
  reason?: string;
};

type TxnDoc = mongoose.Document &
  TxnAttrs & {
    version: number;
    createdAt: Date;
  };

type TxnModel = mongoose.Model<TxnDoc> & {
  buildTxn(attrs: TxnAttrs): Promise<TxnDoc>;
};

const txnSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },

  beneficiary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account'
  },

  reason: {
    type: String
  },

  amount: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    enum: Object.values(TxnStatusEnum),
    required: true
  },

  type: {
    type: String,
    enum: Object.values(TxnTypeEnum),
    required: true
  },

  createdAt: {
    type: mongoose.Schema.Types.Date,
    default: new Date()
  }
});

txnSchema.set('versionKey', 'version');
txnSchema.plugin(updateIfCurrentPlugin);

txnSchema.statics.buildTxn = async function(attrs: TxnAttrs) {
  return await Txn.create(attrs);
};

const Txn = mongoose.model<TxnDoc, TxnModel>('Txn', txnSchema);

export { Txn };
