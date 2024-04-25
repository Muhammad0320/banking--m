import { UserRole } from '@m0banking/common';
import mongoose from 'mongoose';

type UserAttrs = {
  email: string;
  name: string;
  role: UserRole;
};

export type UserDoc = mongoose.Document & UserAttrs & { version: number };

type UserModel = mongoose.Model<UserDoc> & {
  buildUser(attrs: UserAttrs): Promise<UserDoc>;
};

const userSchema = new mongoose.Schema<UserDoc, UserModel>({
  email: {
    type: String,
    required: true,
    unique: true
  },

  name: {
    type: String,
    required: true
  },

  role: {
    typw: String,
    enum: Object.values(UserRole)
  }
});
