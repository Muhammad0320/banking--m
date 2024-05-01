import { AccountUnBlockedEvent, Listener, Subjects } from '@m0banking/common';
import { queueGroupName } from './queueGropName';
import { Message } from 'node-nats-streaming';
import { Notification } from '../../model/notification';

export class AccountUnblockedListener extends Listener<AccountUnBlockedEvent> {
  readonly subject = Subjects.AccountUnblocked;

  queueGroupName = queueGroupName;

  async onMessage(data: AccountUnBlockedEvent['data'], msg: Message) {
    const title = 'Account Unblocked';

    const description =
      "Dear customer, Your Account has been successfully unblocked, now it's safe to transact";

    await Notification.buildNotification({
      title,
      description,
      userId: data.user.id
    });

    msg.ack();
  }
}
