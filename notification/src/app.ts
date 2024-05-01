import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { currentUser, globalErrorHandler, NotFound } from '@m0banking/common';
import { GetAllNotification } from './routes/all';
import { deleteAllNofification } from './routes/deleteAll';
import { deleteNotification } from './routes/delete';
import { ShowNotificationRouter } from './routes/show';

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

const rootUrl = '/api/v1/notification';

app.use(currentUser);

app.use(rootUrl, GetAllNotification);
app.use(rootUrl, deleteNotification);
app.use(rootUrl, deleteAllNofification);
app.use(rootUrl, ShowNotificationRouter);

app.all('*', () => {
  throw new NotFound('Route not found');
});

app.use(globalErrorHandler);

export { app };
