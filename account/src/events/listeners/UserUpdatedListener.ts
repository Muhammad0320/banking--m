import {
  Listener,
  NotFound,
  Subjects,
  UserUpdatedEvent
} from '@m0banking/common';
import { queueGroupName } from './queueGroupName';
import { Message } from 'node-nats-streaming';
import { User } from '../../model/user';

export class UserUpdatedListener extends Listener<UserUpdatedEvent> {
  readonly subject = Subjects.UserUpdated;

  queueGroupName = queueGroupName;

  async onMessage(data: UserUpdatedEvent['data'], msg: Message) {
    const user = await User.findByLastVersionNumberAndId(data.id, data.version);

    if (!user) throw new NotFound('There is no user w/ such id and version');

    await User.findByIdAndUpdate(user.id, data, {
      new: true
    });

    msg.ack();
  }
}
