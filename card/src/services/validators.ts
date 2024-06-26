import { body } from 'express-validator';
import { CardNetwork } from '../enums/CardNewtwork';
import { CardType } from '../enums/CardType';

export const accountValidator = () =>
  body('accountId')
    .trim()
    .notEmpty()
    .isMongoId()
    .withMessage('Please provide a valid mongoose id');

export const billingAddressValidator = () =>
  body('billingAddress')
    .trim()
    .notEmpty()
    .isString()
    .withMessage('Billing address must be a string')
    .isLength({ min: 10, max: 200 })
    .withMessage('Address must be at leat 10 and and at most 200 chars');

export const netwokTypeValidator = () =>
  body('netwokType')
    .trim()
    .notEmpty()
    .custom((input: string) =>
      Object.values(CardNetwork).includes(input as CardNetwork)
    )
    .withMessage('please provide a valid network type');

export const typeValidator = () =>
  body('type')
    .trim()
    .notEmpty()
    .custom((input: string) =>
      Object.values(CardType).includes(input as CardType)
    )
    .withMessage('Please provide a valid Card type');

export const dailyLimitsValidator = () =>
  body('daily')
    .trim()
    .notEmpty()
    .isFloat({ gt: 0 })
    .withMessage('please provide a valid number')
    .custom(
      (input: number, { req }) =>
        input >= req.body.daily || input >= req.body.monthly
    )
    .withMessage('Daily limit must be less than weekly and monthly limits ');

export const weeklyLimitsValidator = () =>
  body('weekly')
    .trim()
    .notEmpty()
    .isFloat({ gt: 0 })
    .withMessage('please provide a valid number')
    .custom(
      (input: number, { req }) =>
        input <= req.body.daily || input >= req.body.monthly
    )
    .withMessage(
      'Weekly Limit must be greater than daily and less that monthly limit'
    );

export const monthlyLimitsValidator = () =>
  body('monthly')
    .trim()
    .notEmpty()
    .isFloat({ gt: 0 })
    .withMessage('please provide a valid number')
    .custom(
      (input: number, { req }) =>
        input <= req.body.daily || input <= req.body.monthly
    )
    .withMessage('Monthly Limit must be greater than daily and monthly limit');
