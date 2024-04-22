import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { currentUser, globalErrorHandler, NotFound } from '@m0banking/common';
import { createAccountRouter } from './routes/new';
import { allAccountsRouter } from './routes/all';

const app = express();

app.set('trust proxy', true);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    httpOnly: true,
    signed: false,
    secure: false
  })
);

console.log('Hi mom');

const rootUrl = '/api/v1/account';

app.use(currentUser);

app.use(rootUrl, allAccountsRouter);
app.use(rootUrl, createAccountRouter);

app.all('*', () => {
  throw new NotFound('Route not found');
});

app.use(globalErrorHandler);

export { app };
