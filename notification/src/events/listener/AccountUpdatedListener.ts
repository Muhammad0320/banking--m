import { AccountBlockedEvent, Listener, Subjects } from '@m0banking/common';
import { queueGroupName } from './queueGropName';
import { Message } from 'node-nats-streaming';
import { Notification } from '../../model/notification';

export class AccountBlockedListener extends Listener<AccountBlockedEvent> {
  readonly subject = Subjects.AccountBlocked;

  queueGroupName = queueGroupName;

  async onMessage(data: AccountBlockedEvent['data'], msg: Message) {
    const title = 'Account Blocked!';

    const description =
      'Dear Customer, Your account has been blocked due to a kind of fraud detection. Please reach out to our helpdesk for possible solution: shit@shit.com ';

    await Notification.buildNotification({
      title,
      description,
      userId: data.user.id
    });

    msg.ack();
  }
}
