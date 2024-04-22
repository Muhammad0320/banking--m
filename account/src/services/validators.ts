import { body } from 'express-validator';

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
