import { Listener, Subjects, USerCreatedEvent } from '@m0banking/common';
import { queueGroupName } from './queueGroupName';

import { Message } from 'node-nats-streaming';
import { User } from '../../model/user';

export class UserCreatedLitener extends Listener<USerCreatedEvent> {
  readonly subject = Subjects.UserCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: USerCreatedEvent['data'], msg: Message) {
    await User.buildUser({
      id: data.id,
      email: data.email,
      name: data.name,
      password: data.password,
      role: data.role
    });

    msg.ack();
  }
}
