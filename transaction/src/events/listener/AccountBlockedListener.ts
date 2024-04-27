import {
  AccountBlockedEvent,
  AccountStatus,
  Listener,
  Subjects
} from '@m0banking/common';
import { queueGroupName } from './queueGroupName';
import { Message } from 'node-nats-streaming';
import { Account } from '../../model/account';

export class AccountBlockedListener extends Listener<AccountBlockedEvent> {
  readonly subject = Subjects.AccountBlocked;

  queueGroupName = queueGroupName;

  async onMessage(data: AccountBlockedEvent['data'], msg: Message) {
    const account = await Account.findByLastVersionAndId(data.id, data.version);

    if (!account) {
      throw new Error('Account not found');
    }

    account.set({ status: AccountStatus.Blocked, _block: true });
    await account.save();

    msg.ack();
  }
}
