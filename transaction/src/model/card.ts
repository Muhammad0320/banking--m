import mongoose from 'mongoose';
import { Account, AccountDoc } from './account';
import {
  AccountStatus,
  BadRequest,
  CardNetwork,
  CardStatus,
  CardType,
  Info,
  NotFound,
  Settings,
  User
} from '@m0banking/common';
import { DateFxns } from '../service/helper';
import { decrypt, hashingWork } from '../service/crypto';

type CardTxnAttrs = {
  no: string;
  cvv: string;
  expYear: number;
  cardName: string;
  expMonth: number;
  billingAddress: string;
};

type CardAttrs = {
  account: AccountDoc;
  user: User;
  settings: Settings;
  info: Info;
  version: number;
};

type CardDoc = mongoose.Document & CardAttrs;

type CardModel = mongoose.Model<CardDoc> & {
  findByLastVersionAndId(id: string, version: number): Promise<CardDoc | null>;
  buildCard(attrs: CardAttrs): Promise<CardDoc>;
};

const cardSchema = new mongoose.Schema<CardDoc, CardModel>({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account'
  },

  user: {
    id: String,
    name: String
  },

  settings: {
    dailyLimit: {
      type: Number,
      default: 500
    },
    weeklyLimit: {
      type: Number,
      default: 500
    },
    monthlyLimit: {
      type: Number,
      default: 5000
    }
  },

  info: {
    no: {
      type: String,
      required: true,
      unique: true
    },

    network: {
      type: String,
      enum: Object.values(CardNetwork)
    },

    type: {
      type: String,
      enum: Object.values(CardType)
    },

    cvv: String,
    expiryDate: {
      type: Date
    },
    issueDate: {
      type: Date,
      default: new Date()
    },
    billingAddress: {
      type: String,
      required: true,
      maxlength: 400,
      minlength: 20
    },

    maxCredit: {
      type: Number,
      default: 50
    },

    status: {
      type: String,
      enum: Object.values(CardStatus),
      default: CardStatus.Inactive
    }
  }
});

cardSchema.pre('save', async function(next) {
  if (this.isModified() && this.info.type === CardType.Debit) {
    this.info.maxCredit = undefined;
  }

  next();
});

cardSchema.methods.validateTxn = async function(attrs: CardTxnAttrs) {
  // const {card: decryptedCard, cvv: decryptedCvv} = decrypt(no, cvv)
};

cardSchema.statics.buildCard = async function(attrs: CardAttrs) {
  const card = await Card.create(attrs);

  return card;
};

cardSchema.statics.findByLastVersionAndId = async function(
  id: string,
  version: number
) {
  const __v = version - 1;

  return await Card.findOne({ _id: id, version: __v });
};

const Card = mongoose.model<CardDoc, CardModel>('Card', cardSchema);

export { Card };
