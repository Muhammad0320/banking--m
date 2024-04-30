import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { currentUser, globalErrorHandler, NotFound } from '@m0banking/common';
import { createTxnRouter } from './routes/newDeposit';
import { createTransferRouter } from './routes/newTransfer';
import { createWithdrawalRouter } from './routes/newWithdrawal';
import { invalidAttemptTracker } from './middlewares/invalidAttemptTracker';

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

const rootUrl = '/api/v1/txn';

app.use(currentUser);

app.use(invalidAttemptTracker);
app.use(rootUrl, createTxnRouter);
app.use(rootUrl, createWithdrawalRouter);
app.use(rootUrl, createTransferRouter);

app.all('*', () => {
  throw new NotFound('Route not found');
});

app.use(globalErrorHandler);

export { app };
