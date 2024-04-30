import { AccountPinUpdatedEvent, Publisher, Subjects } from '@m0banking/common';

export class AccountPinUpdatedPublisher extends Publisher<
  AccountPinUpdatedEvent
> {
  readonly subject = Subjects.AccountPinUpdated;
}
