import mongoose from 'mongoose';
import { AccountDoc } from './account';

type TxnAttrs = {
  id: string;
  account: AccountDoc;
  amount: number;
};

type TxnDoc = mongoose.Document &
  TxnAttrs & { version: number; createdAt: Date };

type TxnModel = mongoose.Model<TxnDoc> & {
  buildTxn(attrs: TxnAttrs): TxnDoc;
};

const txnSchema = new mongoose.Schema<TxnDoc, TxnModel>({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account'
  },

  amount: {
    type: Number,
    required: true
  },

  createdAt: {
    type: mongoose.Schema.Types.Date,
    default: new Date()
  }
});
