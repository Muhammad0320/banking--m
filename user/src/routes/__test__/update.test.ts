import mongoose from 'mongoose';
import { app } from '../../app';
import request from 'supertest';

it('returns error order that 400, if route exists', async () => {
  const response = await request(app).patch(
    '/api/v1/user/' + new mongoose.Types.ObjectId().toString('hex')
  );
});
