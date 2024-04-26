import { USerCreatedEvent, UserRole } from '@m0banking/common';
import { natsWrapper } from '../../../natswrapper';
import { UserCreatedLitener } from '../UserCreatedListener';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { User } from '../../../model/user';

const setup = async () => {
  // create a listener

  const listener = new UserCreatedLitener(natsWrapper.client);

  // cretae a data objext

  const data: USerCreatedEvent['data'] = {
    email: 'lisanalgaib@gmail.com',
    name: 'Paul of Attreides',
    password: 'shit password',
    id: new mongoose.Types.ObjectId().toHexString(),
    role: UserRole.User
  };

  // create a msg

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  // return all

  return { listener, data, msg };
};

it('creates and saved the user', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const user = await User.findById(data.id);

  expect(user).toBeDefined();

  expect(user?.name).toEqual(data.name);
  expect(user?.email).toEqual(data.email);
});
