import { check } from 'express-validator';
import mongoose from 'mongoose';

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
  const { getFullYear, getMonth } = new Date();

  return check('expYear')
    .isInt({ min: getFullYear(), max: getFullYear() + 5 })
    .custom(
      (input: number, { req }) =>
        input === getFullYear() && +req.expMonth - 1 >= getMonth()
    )
    .withMessage('Expired card!')
    .withMessage(' Invalid expiry year ');
};
export const cardNameValidator = () =>
  check('cardName')
    .trim()
    .notEmpty()
    .isLength({ min: 5 })
    .withMessage('Invalid Name');

export const billingAddressValidator = () =>
  check('billingAddress')
    .trim()
    .notEmpty()
    .isLength({ min: 10 })
    .withMessage('Billing address should have a minimum chars of 10');

export const txnAmountValidator = () =>
  check('amount')
    .isInt({ gt: 0 })
    .withMessage('Amount must be greater than 0');

export const txnReasonValidator = () =>
  check('reason')
    .trim()
    .notEmpty()
    .isLength({ min: 4 })
    .withMessage('Txn reason should be more than 4 chars');

export const accountValidator = (field: string) =>
  check(field)
    .trim()
    .notEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage('Provide a valid mongoose id');
