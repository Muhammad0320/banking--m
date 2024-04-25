import { UserRole } from '@m0banking/common';
import mongoose from 'mongoose';

type UserAttrs = {
  email: string;
  name: string;
  password: string;
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

  password: {
    type: String,
    select: false,
    required: true
  },

  name: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: Object.values(UserRole)
  }
});

userSchema.statics.buildUser = async function(attrs: UserAttrs) {
  return await User.create(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
