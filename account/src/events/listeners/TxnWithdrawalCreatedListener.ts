import {
  Listener,
  Subjects,
  TxnWithdrawalCreatedEvent
} from '@m0banking/common';
import { queueGroupName } from './queueGroupName';
import { Message } from 'node-nats-streaming';
import Account from '../../model/account';

export class TxnWithdrawalCreatedListener extends Listener<
  TxnWithdrawalCreatedEvent
> {
  readonly subject = Subjects.TxnWithdrawalCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: TxnWithdrawalCreatedEvent['data'], msg: Message) {
    const account = await Account.findByLastVersionAndId(
      data.account.id,
      data.account.version
    );

    if (!account) throw new Error('Account not found');

    await account.updateOne({ balace: data.account.balance }, { new: true });

    msg.ack();
  }
}
