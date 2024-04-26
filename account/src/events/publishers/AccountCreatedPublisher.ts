import { AccountCreatedEvent, Publisher, Subjects } from '@m0banking/common';

export class AccountCreatedPublisher extends Publisher<AccountCreatedEvent> {
  readonly subject = Subjects.AccountCreated;
}
