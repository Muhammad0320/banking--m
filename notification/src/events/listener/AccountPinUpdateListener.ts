import { AccountPinUpdatedEvent, Listener, Subjects } from '@m0banking/common';
import { queueGroupName } from './queueGropName';
import { Message } from 'node-nats-streaming';
import { Notification } from '../../model/notification';

export class AccountPinUpdateListener extends Listener<AccountPinUpdatedEvent> {
  readonly subject = Subjects.AccountPinUpdated;

  queueGroupName = queueGroupName;

  async onMessage(data: AccountPinUpdatedEvent['data'], msg: Message) {
    const title = 'Account updates';

    const description =
      'Dear Customer, Your account pin has been updated, successfully';

    await Notification.buildNotification({
      title,
      description,
      userId: data.user.id
    });

    msg.ack();
  }
}
