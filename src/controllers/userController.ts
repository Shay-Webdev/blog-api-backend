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
  IReqUser,
} from '../types/request.js';
import { AppError } from '../models/errors.js';
import { sendSuccess } from '../utils/response.js';
import { TUser } from '../types/types.js';
import bcrypt from 'bcryptjs';
import { asyncHandler } from '../middleware/asyncHandler.js';

const getAllUsers = asyncHandler(async function (
  req: IReqUser,
  res: Response<IUserResponse[]>
) {
  if (!req.user) {
    throw new AppError('Authentication required', 401, 'unauthorized');
  }
  const users = await db.getAllUsers();

  const userDetails = users.map((user) => {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      isAuthor: user.isAuthor,
    };
  });

  sendSuccess(res, userDetails, 200, 'Users fetched successfully');
});

const getUserDetails = asyncHandler(async function (
  req: IReqUser,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    throw new AppError('Authentication required', 401, 'unauthorized');
  }
  const userId: number = Number(req.params.userId);
  const userDetails = await db.getDetailsByUserId(userId);
  if (!userDetails) {
    throw new AppError('Resource or Route not found', 404, 'not_found');
  }
  const user = {
    id: userDetails.id,
    username: userDetails.username,
    email: userDetails.email,
    isAuthor: userDetails.isAuthor,
    posts: userDetails.posts,
    comments: userDetails.comments,
  };
  sendSuccess(res, user, 200, 'User fetched successfully');
});

const getUserById = asyncHandler(async function (
  req: IReqUser,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    throw new AppError('Authentication required', 401, 'unauthorized');
  }
  const userId: number = Number(req.params.userId);
  const user = await db.getUserById(userId);
  if (!user) {
    throw new AppError('Resource or Route not found', 404, 'not_found');
  }
  const parsedUser = {
    id: user.id,
    username: user.username,
    email: user.email,
    isAuthor: user.isAuthor,
  };
  sendSuccess(res, parsedUser, 200, 'User fetched successfully');
});

const createUser = asyncHandler(async function (
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

  sendSuccess(res, createdUser, 201, 'User created successfully');
});

const updateUser = asyncHandler(async function (
  req: IReqUser,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    throw new AppError('Authentication required', 401, 'unauthorized');
  }
  const userId: number = Number(req.user.id);
  const updatedUser = await db.makeAuthor(userId);
  if (!updatedUser) {
    throw new AppError('Resource or Route not found', 404, 'not_found');
  }
  sendSuccess(res, updatedUser, 200, 'User updated successfully');
});

export { getAllUsers, createUser, getUserDetails, getUserById, updateUser };
