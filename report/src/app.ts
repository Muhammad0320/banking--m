import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { currentUser, globalErrorHandler, NotFound } from '@m0banking/common';
import { txnSummaryRouter } from './routes/txnSummary';
import { txnSummaryRouterByDate } from './routes/txnSummaryByDate';

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

const rootUrl = '/api/v1/report';

app.use(currentUser);

app.use(rootUrl, txnSummaryRouter);
app.use(rootUrl, txnSummaryRouterByDate);

app.all('*', () => {
  throw new NotFound('Route not found');
});

app.use(globalErrorHandler);

export { app };
