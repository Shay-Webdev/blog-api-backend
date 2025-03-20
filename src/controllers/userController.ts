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
  req: Request<{}, {}, IUserRequestBody>,
  res: Response,
  next: NextFunction
) {
  console.log('req body in createUser', req.body);

  const user = await db.createUser(req.body);
  sendSuccess(res, user, 201, 'User created successfully');
}

export { getAllUsers, createUser };
