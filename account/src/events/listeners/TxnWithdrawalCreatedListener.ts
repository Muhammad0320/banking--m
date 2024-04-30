import {
  Listener,
  Subjects,
  TxnWithdrawalCreatedEvent
} from '@m0banking/common';
import { queueGroupName } from './queueGroupName';
import { Message } from 'node-nats-streaming';

export class TxnWithdrawalCreatedListener extends Listener<
  TxnWithdrawalCreatedEvent
> {
  readonly subject = Subjects.TxnWithdrawalCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: TxnWithdrawalCreatedEvent['data'], msg: Message) {}
}
