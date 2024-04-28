import { app } from './app';
import mongoose from 'mongoose';
import { natsWrapper } from '../natswrapper';
import { AccountCreatedListener } from './events/listener/AccountCreatedListener';
import { AccountBlockedListener } from './events/listener/AccountBlockedListener';
import { AccountUnblockedListener } from './events/listener/AccountUnBlockedListener';

const start = async () => {
  const port = 3000;

  if (!process.env.JWT_KEY) {
    throw new Error(' JWT_KEY not found ');
  }

  if (!process.env.MONGO_URI) {
    throw new Error(' MONGO_URI not found ');
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on('close', () => {
      console.log(' NATS connection closed! ');
      process.exit();
    });

    process.on('SIGTERM', () => natsWrapper.client.close());
    process.on('SIGINT', () => natsWrapper.client.close());

    new AccountCreatedListener(natsWrapper.client).listen();
    new AccountBlockedListener(natsWrapper.client).listen();
    new AccountUnblockedListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI);

    console.log('connected to mongoDB');
  } catch (error) {
    console.error(error);
  }

  app.listen(port, () => {
    console.log('App running on port ', port);
  });
};

start();
