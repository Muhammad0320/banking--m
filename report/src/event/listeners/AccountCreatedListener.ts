import { AccountCreatedEvent, Listener, Subjects } from '@m0banking/common';
import { queueGroupName } from './queueGroupName';
import { Message } from 'node-nats-streaming';
import { Account } from '../../models/account';

export class AccountCreatedListener extends Listener<AccountCreatedEvent> {
  readonly subject = Subjects.AccountCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: AccountCreatedEvent['data'], msg: Message) {
    await Account.buildAccount({
      ...data,
      userId: data.user.id
    });

    msg.ack();
  }
}
