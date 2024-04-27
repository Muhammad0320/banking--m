import { AccountCreatedEvent, Listener, Subjects } from '@m0banking/common';
import { queueGroupName } from './queueGroupName';
import { Message } from 'node-nats-streaming';
import { Account } from '../../model/account';

export class AccountCreatedListener extends Listener<AccountCreatedEvent> {
  readonly subject = Subjects.AccountCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: AccountCreatedEvent['data'], msg: Message) {
    const pin = '1967';

    await Account.buildAccount({ ...data, pin });

    msg.ack();
  }
}
