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

export const expiryYearValidator = () => {
  const { getFullYear } = new Date();

  return check('expYear')
    .isInt({ min: getFullYear(), max: getFullYear() + 5 })
    .withMessage(' Invalid expiry year ');
};
export const cardNameValidator = () =>
  check('cardName')
    .trim()
    .notEmpty()
    .isLength({ min: 5 })
    .withMessage('Invalid Name');
