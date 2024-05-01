import { Listener, Subjects, TxnTransferCreatedEvent } from '@m0banking/common';
import { queueGroupName } from './queueGroupName';
import { Message } from 'node-nats-streaming';
import Account from '../../model/account';

export class TxnTransferCreatedListener extends Listener<
  TxnTransferCreatedEvent
> {
  readonly subject = Subjects.TxnTransferCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: TxnTransferCreatedEvent['data'], msg: Message) {
    const account = await Account.findByLastVersionAndId(
      data.account.id,
      data.account.version
    );

    const beneficiary = await Account.findByLastVersionAndId(
      data.beneficiary.id,
      data.beneficiary.version
    );

    if (!account || !beneficiary)
      throw new Error('Account or beneficiary not found');

    await account.updateOne({ balance: data.account.balance }, { new: true });
    await beneficiary.updateOne(
      { balance: data.beneficiary.balance },
      { new: true }
    );

    msg.ack();
  }
}
