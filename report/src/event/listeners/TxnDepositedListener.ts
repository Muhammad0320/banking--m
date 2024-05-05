import { Listener, Subjects, TxnDepositCreatedEvent } from '@m0banking/common';
import { queueGroupName } from './queueGroupName';
import { Message } from 'node-nats-streaming';
import { Txn } from '../../models/transaction';
import { Account } from '../../models/account';

export class TxnDepsitListener extends Listener<TxnDepositCreatedEvent> {
  readonly subject = Subjects.TxnDepositCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: TxnDepositCreatedEvent['data'], msg: Message) {
    const account = await Account.findById(data.account.id);

    if (!account) {
      throw new Error('Account not found');
    }

    await Txn.buildTxn({
      ...data,
      account
    });

    msg.ack();
  }
}
