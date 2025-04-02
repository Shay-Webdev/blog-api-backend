import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import { loginValidation } from '../validation/loginValidation.js';
import { validationResult } from 'express-validator';
import { AppError } from '../models/errors.js';
import passport from 'passport';
import { customAuthError } from '../authentication/customAuthError.js';
import { IReqUser } from '../types/request.js';

const loginUser = [
  loginValidation,

  asyncHandler(async (req: IReqUser, res: Response, next: NextFunction) => {
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
    next();
  }),
  customAuthError,
  asyncHandler(async (req: IReqUser, res: Response) => {
    // Wrap in asyncHandler
    console.log('req.user in login:', req.user);
    sendSuccess(res, req.user, 200, 'Login successful');
  }),
];

export { loginUser };
