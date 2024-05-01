import { AccountUnBlockedEvent, Listener, Subjects } from '@m0banking/common';

export class AccountUnblockedListener extends Listener<AccountUnBlockedEvent> {
  readonly subject = Subjects.AccountUnblocked;
}
