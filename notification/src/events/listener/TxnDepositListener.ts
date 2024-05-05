import { Listener, Subjects, TxnDepositCreatedEvent } from '@m0banking/common';
import { queueGroupName } from './queueGropName';
import { Message } from 'node-nats-streaming';
import { Notification } from '../../model/notification';

export class TxnDeositListener extends Listener<TxnDepositCreatedEvent> {
  readonly subject = Subjects.TxnDepositCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: TxnDepositCreatedEvent['data'], msg: Message) {
    const title = 'Credit Alert!!!';

    const description = `Dear Customer, Your account has been credited with ${data.amount}. \n Your new balance is: ${data.account.balance}`;

    await Notification.buildNotification({
      title,
      description,
      userId: 'shit id'
    });

    msg.ack();
  }
}
