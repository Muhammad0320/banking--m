import { Publisher, Subjects, UserUpdatedEvent } from '@m0banking/common';

export class USerUpdatedPublisher extends Publisher<UserUpdatedEvent> {
  readonly subject = Subjects.UserUpdated;
}
