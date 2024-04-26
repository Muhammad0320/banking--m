import { Publisher, Subjects, USerCreatedEvent } from '@m0banking/common';

export class UserCreatedPublisher extends Publisher<USerCreatedEvent> {
  readonly subject = Subjects.UserCreated;
}
