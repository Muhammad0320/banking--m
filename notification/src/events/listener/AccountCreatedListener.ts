import { Listener, AccountCreatedEvent, Subjects } from '@m0banking/common';
import { queueGroupName } from './queueGropName';
import { Message } from 'node-nats-streaming';
import { Notification } from '../../model/notification';

// Add name and type of the account to the user;

export class AccountCreatedListener extends Listener<AccountCreatedEvent> {
  readonly subject = Subjects.AccountCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: AccountCreatedEvent['data'], msg: Message) {
    const title = 'New Account Created';
    const description =
      `Hello ${data.userId}, a new account has been created for you with the following details:\n` +
      `- Account Number: ${data.no}\n` +
      // `- Account Type: ${data}\n` +
      `- Balance: ${data.balance}\n\n` +
      'Thank you for banking with us!';

    await Notification.buildNotification({
      title,
      description,
      userId: data.userId
    });

    msg.ack();
  }
}
