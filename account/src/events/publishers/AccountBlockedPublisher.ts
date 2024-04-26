import { Publisher, AccountBlockedEvent, Subjects } from '@m0banking/common';

export class AccountBlockPublisher extends Publisher<AccountBlockedEvent> {
  readonly subject = Subjects.AccountBlocked;
}
