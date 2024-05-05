import {
  AccountStatus,
  AccountUnBlockedEvent,
  Listener,
  Subjects
} from '@m0banking/common';
import { queueGroupName } from './queueGroupName';
import { Message } from 'node-nats-streaming';
import { Account } from '../../models/account';

export class AccountUnblockedListener extends Listener<AccountUnBlockedEvent> {
  readonly subject = Subjects.AccountUnblocked;

  queueGroupName = queueGroupName;

  async onMessage(data: AccountUnBlockedEvent['data'], msg: Message) {
    const account = await Account.findByLastVersionAndId(data.id, data.version);

    if (!account) {
      throw new Error('Account not found');
    }

    account.set({ status: AccountStatus.Active, _block: false });
    await account.save();

    msg.ack();
  }
}
