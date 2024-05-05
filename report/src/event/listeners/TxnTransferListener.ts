import {
  Listener,
  Subjects,
  TxnTransferCreatedEvent,
  TxnTypeEnum
} from '@m0banking/common';
import { queueGroupName } from './queueGroupName';
import { Message } from 'node-nats-streaming';
import { Txn } from '../../models/transaction';
import { Account } from '../../models/account';

export class TxnTransferListener extends Listener<TxnTransferCreatedEvent> {
  readonly subject = Subjects.TxnTransferCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: TxnTransferCreatedEvent['data'], msg: Message) {
    const account = await Account.findById(data.account.id);

    const benAccount = await Account.findById(data.beneficiary.id);

    if (!account) {
      throw new Error('Account not found');
    }

    if (!benAccount) {
      throw new Error(' Beneficiary Account not found');
    }

    await Txn.buildTxn({
      ...data,
      account,
      beneficiary: benAccount,

      type: TxnTypeEnum.Transfer
    });

    msg.ack();
  }
}
