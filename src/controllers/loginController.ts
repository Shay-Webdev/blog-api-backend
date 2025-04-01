import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import { loginValidation } from '../validation/loginValidation.js';
import { validationResult } from 'express-validator';
import { AppError } from '../models/errors.js';

const loginUser = [
  loginValidation,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    const errorMessages = errors.array().map((error) => error.msg);
    if (!errors.isEmpty()) {
      if (
        errorMessages.includes('Email is required') ||
        errorMessages.includes('Password is required')
      ) {
        throw new AppError(
          'Missing input',
          400,
          'missing_field',
          errors.array()
        );
      } else if (
        errorMessages.includes('Invalid email') ||
        errorMessages.includes('Password must be at least 8 characters long')
      ) {
        throw new AppError(
          'Invalid input',
          400,
          'invalid_field',
          errors.array()
        );
      }
    }
    console.log('req user in login', req.user);

    res.status(200).json({ message: 'Login successful', user: req.body });
  }),
];

export { loginUser };
