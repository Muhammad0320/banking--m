import { body, check } from 'express-validator';

export const cardNumberValidator = () =>
  check('no')
    .isCreditCard()
    .withMessage('Invalid Credit Card format!');

export const cvvValidator = () =>
  check('cvv')
    .isNumeric()
    .isLength({ min: 3, max: 3 })
    .withMessage(' Invalid CVV format! ');

export const expiryMonthValidator = () =>
  check('expMonth')
    .isInt({ min: 1, max: 12 })
    .withMessage(' Month should be within 1 - 12 ');
