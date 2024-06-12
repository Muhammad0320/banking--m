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
import { hashingWork } from '../services/crypto';
import { DateFxns } from '../services/helper';

type CardDoc = mongoose.Document & {
  account: AccountDoc;
  user: User;
  settings: Settings;
  info: Info;
  version: number;
};

type CardAttrs = {
  accountId: string;
  billingAddress: string;
  networkType: CardNetwork;
  type: CardType;
};

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

cardSchema.statics.buildCard = async function(attrs: CardAttrs) {
  const { accountId, billingAddress, networkType, type } = attrs;

  const { yy, mm } = DateFxns();

  const account = await Account.findById(accountId);

  if (!!!account) throw new NotFound('Account not found');

  if (account.status !== AccountStatus.Active)
    throw new BadRequest('Your account is blocked');

  const existingCard = await Card.findOne({ account: accountId });

  if (existingCard?.info.status !== CardStatus.Expired)
    throw new BadRequest("You can't own multiple unexpired cards for now!");

  const {
    cvv: { hashed: hashedCvv, unhashed: unhashedCvv },
    card: { hashed: hashedCard, unhashed: unhashedCard }
  } = hashingWork();

  const card = await Card.create({
    account: account.id,

    user: {
      id: account.user.id,
      name: account.user.name
    },

    info: {
      billingAddress,
      network: networkType,
      type,
      no: hashedCard,
      cvv: hashedCvv,
      expiryDate: new Date(yy, mm)
    }
  });

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
