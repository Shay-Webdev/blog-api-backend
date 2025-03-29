import * as db from '../models/queries.js';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../models/errors.js';
import { sendSuccess } from '../utils/response.js';
import { TUser } from '../types/types.js';
import bcrypt from 'bcryptjs';
import { IUserRequestBody } from '../types/request.js';
import { validationResult } from 'express-validator';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { signupValidation } from '../validation/signupValidation.js';

const createUserFunction = asyncHandler(async function (
  req: Request<{}, {}, Omit<IUserRequestBody, 'id'>>,
  res: Response,
  next: NextFunction
) {
  // console.log('req body in createUser', req.body);
  // const reqUser = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(`errors in  createUser validation`, errors.array());

    if (
      errors.array()[0].msg === 'Username is required' ||
      'Email is required' ||
      'Password is required'
    ) {
      console.log('errors in  createUser validation/missing input');

      throw new AppError('Missing input', 400, 'missing_field', errors.array());
    } else if (
      errors.array()[0].msg === 'Password must be at least 8 characters long' ||
      'Name must be at least 3 characters long'
    ) {
      console.log('errors in  createUser validation/invalid input');
      throw new AppError('Invalid input', 400, 'invalid_field', errors.array());
    } else if (errors.array()[0].msg === 'Email already exists') {
      console.log('errors in  createUser validation/duplicate resource');
      throw new AppError(
        'Resource trying to create already exists',
        409,
        'duplicate_resource',
        errors.array()
      );
    }
    throw new AppError(
      'Internal server error',
      500,
      'internal_server_error',
      errors.array()[0].msg
    );
  }
  console.log('req body in createUser/signup', req.body);
  console.log('req query in createUser/signup', req.query);
  console.log('req params in createUser/signup', req.params);

  const parsedUser: Omit<TUser, 'id'> = {
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    isAuthor: req.body.isAuthor === 'true' ? true : false,
  };

  const createdUser = await db.createUser(parsedUser);
  console.log('createdUser in signup', createdUser);

  sendSuccess(res, createdUser, 201, 'User created successfully');
});
const createUser = [signupValidation, createUserFunction];

export { createUser };
