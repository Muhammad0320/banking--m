import { Listener, Subjects, TxnDepositCreatedEvent } from '@m0banking/common';
import { queueGroupName } from './queueGroupName';
import { Message } from 'node-nats-streaming';
import Account from '../../model/account';

export class TxnDepositedListener extends Listener<TxnDepositCreatedEvent> {
  readonly subject = Subjects.TxnDepositCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: TxnDepositCreatedEvent['data'], msg: Message) {
    const account = await Account.findByLastVersionAndId(data.id, data.version);

    if (!account) throw new Error('account not found');

    await account.updateOne({ balace: data.account.balance }, { new: true });

    msg.ack();
  }
}
