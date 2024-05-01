import { Listener, Subjects, TxnDepositCreatedEvent } from '@m0banking/common';
import { queueGroupName } from './queueGroupName';
import { Message } from 'node-nats-streaming';
import Account from '../../model/account';

export class TxnDepositedListener extends Listener<TxnDepositCreatedEvent> {
  readonly subject = Subjects.TxnDepositCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: TxnDepositCreatedEvent['data'], msg: Message) {
    const account = await Account.findByLastVersionAndId(
      data.account.id,
      data.account.version
    );

    if (!account) throw new Error('account not found');

    account.set({ balance: data.account.balance });
    await account.save();
    
    msg.ack();
  }
}
