import mongoose from 'mongoose';

type NotificationAttrs = {
  userId: string;
  title: string;
  description: string;
  timeStamp: Date;
  read: string; // enum
};

type NotificationDoc = mongoose.Document<NotificationAttrs>;

type NotificationModel = mongoose.Model<NotificationDoc> & {
  buildNotification(attrs: NotificationAttrs): Promise<NotificationDoc>;
};
