import * as db from '../models/queries.js';
import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import { loginValidation } from '../validation/loginValidation.js';
import { validationResult } from 'express-validator';
import { AppError } from '../models/errors.js';
import passport from 'passport';
import { customLocalAuth } from '../authentication/customAuthError.js';
import { IReqUser } from '../types/request.js';
import { IJwtPayload, IRefreshToken } from '../types/types.js';
import { generateKey } from 'crypto';
import { generateRefreshToken, generateToken } from '../utils/jwt.js';

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
  customLocalAuth,
  asyncHandler(async (req: IReqUser, res: Response) => {
    if (!req.user) {
      throw new AppError('Access denied', 401, 'auth_failed', {
        error: 'user not found in login controller',
      });
    }
    const token = await generateToken(req.user as IJwtPayload);
    const refreshToken = await generateRefreshToken(req.user as IJwtPayload);
    const expireTime = 7 * 24 * 60 * 60 * 1000;
    const expireDate = new Date(Date.now() + expireTime);
    if (!token || !refreshToken) {
      throw new AppError(
        'Internal server error',
        500,
        'internal_server_error',
        { token, error: 'token sign failed' }
      );
    }
    const refreshTokenObj: Pick<
      IRefreshToken,
      'userId' | 'token' | 'expiresAt'
    > = {
      userId: req.user.id,
      token: refreshToken,
      expiresAt: expireDate,
    };
    console.log('req.user in login:', req.user);
    console.log('tokens in login:', token, refreshToken);
    const refreshTokenInDb = await db.createRefreshToken(refreshTokenObj);
    console.log('refreshTokenInDb in login:', refreshTokenInDb);

    // send token to user?
    // res.status(200).json({ user: req.user, token });
    sendSuccess(
      res,
      { user: req.user, token, refreshToken },
      200,
      'Login successful'
    );
  }),
];

export { loginUser };
