import mongoose from 'mongoose';
import { User } from '../../../model/user';
import { natsWrapper } from '../../../natswrapper';
import { UserUpdatedListener } from '../UserUpdatedListener';
import { UserRole, UserUpdatedEvent } from '@m0banking/common';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  // create a listener
  const listener = new UserUpdatedListener(natsWrapper.client);

  // create a user

  const newUSer = await User.buildUser({
    id: new mongoose.Types.ObjectId().toHexString(),
    name: 'Lisan al-gaib',
    email: 'lisanalgaib@gmail.com',
    password: 'shit passwor',
    version: 0,
    role: UserRole.User
  });

  // create a data

  const data: UserUpdatedEvent['data'] = {
    email: newUSer.email,
    name: 'Al mehdi usul',
    password: newUSer.password,
    id: newUSer.id,
    version: newUSer.version + 1
  };

  // create msg object

  // @ts-ignore

  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, data, msg };
};

it('updates and saves a ticket', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedUser = await User.findById(data.id);

  console.log(updatedUser, 'from test');

  expect(updatedUser).toBeDefined();
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
