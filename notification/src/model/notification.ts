import mongoose from 'mongoose';

type NotificationAttrs = {
  userId: string;
  title: string;
  description: string;
};

type NotificationDoc = mongoose.Document<NotificationAttrs> & {
  createdAt: Date;
  status: string; // enum
};

type NotificationModel = mongoose.Model<NotificationDoc> & {
  buildNotification(attrs: NotificationAttrs): Promise<NotificationDoc>;
};

const notSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },

  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    default: new Date()
  },

  status: {
    type: String
  }
});
