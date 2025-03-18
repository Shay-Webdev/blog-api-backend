import * as db from '../models/queries.js';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import {
  IUserResponse,
  ICommentResponse,
  IPostResponse,
} from '../types/response.js';

const getAllUsers: RequestHandler = async (
  req: Request,
  res: Response<IUserResponse[]>
) => {
  const users = await db.getAllUsers();
  const userDetails = users.map((user) => {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      isAuthor: user.isAuthor,
    };
  });

  res.status(200).json(userDetails);
};

export { getAllUsers };
