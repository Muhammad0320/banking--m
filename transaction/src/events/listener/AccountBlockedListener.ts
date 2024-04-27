import { AccountBlockedEvent, Listener, Subjects } from '@m0banking/common';
import { queueGroupName } from './queueGroupName';
import { Message } from 'node-nats-streaming';

export class AccountBlockedListener extends Listener<AccountBlockedEvent> {
  readonly subject = Subjects.AccountBlocked;

  queueGroupName = queueGroupName;

  async onMessage(data: AccountBlockedEvent['data'], msg: Message) {}
}
