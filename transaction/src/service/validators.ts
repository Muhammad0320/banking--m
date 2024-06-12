import { body, check } from 'express-validator';

export const cardNo = () =>
  check('no')
    .isNumeric()
    .withMessage('card number must be numeric')
    .isLength({ max: 16, min: 16 })
    .withMessage('card number must be exactly 16 characters long');
