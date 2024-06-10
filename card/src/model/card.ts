import mongoose from 'mongoose';
import { AccountDoc } from './account';
import { CardType } from '../enums/CardType';
import { CardStatus } from '../enums/CardStatus';
import { CardNetwork } from '../enums/CardNewtwork';
import { Info, Settings, User } from '../types/CardFieldTypes';

type CardDoc = mongoose.Document & {
  account: AccountDoc;
  user: User;
  settings: Settings;
  info: Info;
  version: number;
};

type CardModel = mongoose.Model<CardDoc> & {
  findByLastVersionAndId(id: string, version: number): Promise<CardDoc | null>;
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

    status: {
      type: String,
      enum: Object.values(CardStatus),
      default: CardStatus.Inactive
    }
  }
});

cardSchema.statics.findByLastVersionAndId = async function(
  id: string,
  version: number
) {
  const __v = version - 1;

  return await Card.findOne({ _id: id, version: __v });
};

const Card = mongoose.model<CardDoc, CardModel>('Card', cardSchema);

export { Card };
