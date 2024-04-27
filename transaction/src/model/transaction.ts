import mongoose from 'mongoose';
import { AccountDoc } from './account';

type TxnAttrs = {
  id: string;
  accountId: AccountDoc;
  amount: number;
};

type TxnDoc = mongoose.Document & TxnAttrs & { version: number };

type TxnModel = mongoose.Model<TxnDoc> & {
  buildTxn(attrs: TxnAttrs): TxnDoc;
};
