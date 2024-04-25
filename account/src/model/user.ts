import { UserRole } from '@m0banking/common';
import mongoose from 'mongoose';

type UserAttrs = {
  email: string;
  name: string;
  role: UserRole;
};

export type UserDoc = mongoose.Document & UserAttrs & { version: number };

type USerModel = mongoose.Model<UserDoc> & {
  buildUser(attrs: UserAttrs): Promise<UserDoc>;
};
