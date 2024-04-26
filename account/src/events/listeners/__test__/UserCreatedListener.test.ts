import { USerCreatedEvent, UserRole } from '@m0banking/common';
import { natsWrapper } from '../../../natswrapper';
import { UserCreatedLitener } from '../UserCreatedListener';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

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
