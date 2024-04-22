import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import jwt from 'jsonwebtoken';
import { UserRole, UserStatus } from '@m0banking/common';

let mongo: any;

declare global {
  var signin: (id?: string) => Promise<string[]>;
}

beforeAll(async () => {
  process.env.JWT_KEY = 'my-super-long-and-ultra-secured-jwt-secret-key';
  process.env.JWT_EXPIRES_IN = '24';
  mongo = await MongoMemoryServer.create();

  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri);
});

afterEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }

  await mongoose.connection.close();
});

global.signin = async (id?: string, role?: UserRole) => {
  const userId = id || new mongoose.Types.ObjectId().toHexString();

  const payload = {
    id: userId,
    name: 'Lisan al-gaib',
    email: 'lisanalgaib@gmail.com',
    password: 'ngjiorjrioiojrriior',
    role: role || UserRole.User,
    avatar: 'shit image',
    createdAt: new Date(),
    status: UserStatus.Active
  };

  // create a jwt

  if (!process.env.JWT_KEY) throw new Error('');

  const token = jwt.sign(payload, process.env.JWT_KEY);

  // Build a session obj { jwt: MY_JWT }

  const sessionObj = { jwt: token };

  // Turn the session obj into json string

  const sessionJSon = JSON.stringify(sessionObj);

  // Encode the json as base 64

  const base64 = Buffer.from(sessionJSon).toString('base64');

  // returns a string and that's the cookie with encoded data

  return [`session=${base64}`];
};
