import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { UserRole } from '@m0banking/common';

type UserAttrs = {
  id: string;
  email: string;
  name: string;
  password: string;
  role: UserRole;
  version: number;
};

export type UserDoc = mongoose.Document & UserAttrs;

type UserModel = mongoose.Model<UserDoc> & {
  buildUser(attrs: UserAttrs): Promise<UserDoc>;
  findByLastVersionNumberAndId(
    id: string,
    version: number
  ): Promise<UserDoc | null>;
};

const userSchema = new mongoose.Schema(
  {
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

userSchema.set('versionKey', 'version');
userSchema.plugin(updateIfCurrentPlugin);

userSchema.statics.buildUser = async function(attrs: UserAttrs) {
  return await User.create({ ...attrs, _id: attrs.id });
};

userSchema.statics.findByLastVersionNumberAndId = async function(
  id: string,
  version: number
) {
  const __v = version - 1;

  return await User.findOne({ _id: id, version: __v });
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
