import { body, validationResult } from 'express-validator';

const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email')
    .escape(),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .escape(),
];

export { loginValidation };
