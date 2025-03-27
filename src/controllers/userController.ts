import * as db from '../models/queries.js';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import {
  IUserResponse,
  ICommentResponse,
  IPostResponse,
} from '../types/response.js';
import {
  IUserRequestBody,
  IPostRequestBody,
  ICommentRequestBody,
} from '../types/request.js';
import { AppError } from '../models/errors.js';
import { sendSuccess } from '../utils/response.js';
import { TUser } from '../types/types.js';
import bcrypt from 'bcryptjs';

async function getAllUsers(req: Request, res: Response<IUserResponse[]>) {
  const users = await db.getAllUsers();
  if (!users) {
    throw new AppError('No users found', 404);
  }
  const userDetails = users.map((user) => {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      isAuthor: user.isAuthor,
    };
  });

  sendSuccess(res, userDetails, 200, 'Users fetched successfully');
}

async function createUser(
  req: Request<{}, {}, Omit<IUserRequestBody, 'id'>>,
  res: Response,
  next: NextFunction
) {
  //   console.log('req body in createUser', req.body);
  //   const createdUser = req.body;

  console.log('req body in createUser/signup', req.body);
  const parsedUser: Omit<TUser, 'id'> = {
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    isAuthor: req.body.isAuthor === 'true' ? true : false,
  };

  const createdUser = await db.createUser(parsedUser);
  console.log('createdUser in signup', createdUser);

  if (!createdUser) {
    throw new AppError('User not found', 404);
  }
  sendSuccess(res, createdUser, 201, 'User created successfully');
}

export { getAllUsers, createUser };
