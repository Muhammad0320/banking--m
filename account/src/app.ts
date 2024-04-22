import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { allAccountsRouter } from './routes/all';
import { showAccountRouter } from './routes/show';
import { createAccountRouter } from './routes/new';
import { blockAccountRouter } from './routes/block';
import { updatePinRouter } from './routes/updatePin';
import { unblockAccountRouter } from './routes/unblock';
import { currentUser, globalErrorHandler, NotFound } from '@m0banking/common';

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

app.use(rootUrl, updatePinRouter);
app.use(rootUrl, allAccountsRouter);
app.use(rootUrl, showAccountRouter);
app.use(rootUrl, blockAccountRouter);
app.use(rootUrl, createAccountRouter);
app.use(rootUrl, unblockAccountRouter);

app.all('*', () => {
  throw new NotFound('Route not found');
});

app.use(globalErrorHandler);

export { app };
