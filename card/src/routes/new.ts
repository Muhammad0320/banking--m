import { requireAuth } from '@m0banking/common';
import express from 'express';

const router = express.Router();

router.post('/', requireAuth);
