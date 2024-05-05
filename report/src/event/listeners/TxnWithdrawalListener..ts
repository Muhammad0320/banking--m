import {
  Listener,
  Subjects,
  TxnWithdrawalCreatedEvent,
  TxnTypeEnum
} from '@m0banking/common';
import { Message } from 'node-nats-streaming';
import { Txn } from '../../models/transaction';
import { Account } from '../../models/account';
import { queueGroupName } from './queueGroupName';

export class TxnWithdrawalListener extends Listener<TxnWithdrawalCreatedEvent> {
  readonly subject = Subjects.TxnWithdrawalCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: TxnWithdrawalCreatedEvent['data'], msg: Message) {
    const account = await Account.findById(data.account.id);

    if (!account) {
      throw new Error('Account not found');
    }

    await Txn.buildTxn({
      ...data,
      account,
      type: TxnTypeEnum.Withdrawal
    });

    msg.ack();
  }
}
