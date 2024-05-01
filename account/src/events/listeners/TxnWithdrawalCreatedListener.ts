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
    const ckeck = await Account.find();

    console.log(data, 'from the before checkkkkkk');

    console.log(ckeck, 'from the checkkkkkkkkk');

    console.log(
      await Account.findById(data.account.id),
      'from after checkkkkkkkkkk'
    );

    const account = await Account.findByLastVersionAndId(
      data.account.id,
      data.account.version
    );

    console.log(account, 'from the txn withdrawal');

    if (!account) throw new Error('Account not found');

    account.set({ balance: data.account.balance });
    await account.save();

    msg.ack();
  }
}
