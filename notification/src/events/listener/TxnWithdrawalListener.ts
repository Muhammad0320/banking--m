import {
  Listener,
  Subjects,
  TxnWithdrawalCreatedEvent
} from '@m0banking/common';
import { queueGroupName } from './queueGropName';
import { Message } from 'node-nats-streaming';
import { Notification } from '../../model/notification';

export class TxnwithdrawalListener extends Listener<TxnWithdrawalCreatedEvent> {
  readonly subject = Subjects.TxnWithdrawalCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: TxnWithdrawalCreatedEvent['data'], msg: Message) {
    const title = 'Debit Alert!!!';

    const description = `Dear Customer, Your account has been debited with shit amout. \n Your new balance is: ${data.account.balance}`;

    await Notification.buildNotification({
      title,
      description,
      userId: 'shit id'
    });

    msg.ack();
  }
}
