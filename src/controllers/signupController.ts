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
    throw new AppError(errors.array()[0].msg, 400);
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

  const createdUser = parsedUser;
  console.log('createdUser in signup', createdUser);

  // const createdUser = await db.createUser(parsedUser);
  // console.log('createdUser in signup', createdUser);

  if (!createdUser) {
    throw new AppError('User not found', 404);
  }
  sendSuccess(res, createdUser, 201, 'User created successfully');
});
const createUser = [signupValidation, createUserFunction];

export { createUser };
