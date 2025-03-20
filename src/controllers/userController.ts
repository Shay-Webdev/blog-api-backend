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

  res.status(200).json(userDetails);
}

async function createUser(
  req: Request<{}, {}, IUserRequestBody>,
  res: Response,
  next: NextFunction
) {
  console.log('req body in createUser', req.body);

  const user = await db.createUser(req.body);
  if (!user) {
    throw new AppError('User already exists', 400);
  }

  res.status(201).json({ message: 'User created successfully', user });
}

export { getAllUsers, createUser };
