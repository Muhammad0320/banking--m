import { AccountUnBlockedEvent, Publisher, Subjects } from '@m0banking/common';

export class AccountUnblockedPublisher extends Publisher<
  AccountUnBlockedEvent
> {
  readonly subject = Subjects.AccountUnblocked;
}
