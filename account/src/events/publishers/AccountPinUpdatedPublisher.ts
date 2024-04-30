import { AccountPinUpdatedEvent, Publisher, Subjects } from '@m0banking/common';

export class AppPinUpdatedPublisher extends Publisher<AccountPinUpdatedEvent> {
  readonly subject = Subjects.AccountPinUpdated;
}
