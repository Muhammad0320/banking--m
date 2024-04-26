import { app } from './app';
import mongoose from 'mongoose';
import { natsWrapper } from './natswrapper';

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

  await natsWrapper.connect(
    process.env.NATS_CLUSTER_ID,
    process.env.NATS_CLIENT_ID,
    process.env.NATS_URL
  );

  try {
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
