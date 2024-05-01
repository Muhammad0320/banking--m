import { AccountPinUpdatedEvent, Listener, Subjects } from '@m0banking/common';
import { queueGroupName } from './queueGropName';
import { Message } from 'node-nats-streaming';
import { Notification } from '../../model/notification';

export class AccountPinUpdateListener extends Listener<AccountPinUpdatedEvent> {
  readonly subject = Subjects.AccountPinUpdated;

  queueGroupName = queueGroupName;

  async onMessage(data: AccountPinUpdatedEvent['data'], msg: Message) {
    msg.ack();
  }
}
