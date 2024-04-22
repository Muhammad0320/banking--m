import { body } from 'express-validator';
import { AccountTier } from '../enums/AccountTier';
import { AccountCurrency } from '../enums/AccountCurrencyEnum';
import mongoose from 'mongoose';

export const pinValidator = () =>
  body('pin')
    .isInt({ min: 4, max: 4 })
    .withMessage('Account pin should be exactly 4 numbers');

export const pinConfirmValidator = () =>
  body('pinConfirm')
    .isInt({ min: 4, max: 4 })
    .custom((input: number, { req }) => {
      input === req.body.pin;
    })
    .withMessage('Pins should be the same');

export const tierValidator = () =>
  body('tier')
    .trim()
    .notEmpty()
    .custom((input: string) =>
      Object.values(AccountTier).includes(input as AccountTier)
    )
    .withMessage('please prove a valid tier');

export const currencyValidator = () =>
  body('currency')
    .trim()
    .notEmpty()
    .custom((input: string) =>
      Object.values(AccountCurrency).includes(input as AccountCurrency)
    )
    .withMessage('please provide a valid currency type');

export const userIdValidator = () =>
  body('userId')
    .trim()
    .notEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage('please provide a valid mongoose id');
