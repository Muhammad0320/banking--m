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
    .withMessage('Billing address must be a string');

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
