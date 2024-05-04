import { Listener, Subjects, TxnTransferCreatedEvent } from '@m0banking/common';
import { queueGroupName } from './queueGropName';
import { Message } from 'node-nats-streaming';
import { Notification } from '../../model/notification';

export class TxnTransferListener extends Listener<TxnTransferCreatedEvent> {
  readonly subject = Subjects.TxnTransferCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: TxnTransferCreatedEvent['data'], msg: Message) {
    const title = 'Debit Alert!!!';

    const description = `Dear Customer, Your account successfully transferred ${data.amount} to ${data.beneficiary.userId}  .\n Your new balance is: ${data.account.balance}`;

    await Notification.buildNotification({
      title,
      description,
      userId: data.account.userId
    });
  }
}
