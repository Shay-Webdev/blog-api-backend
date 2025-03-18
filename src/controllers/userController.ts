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

async function getAllUsers(req: Request, res: Response<IUserResponse[]>) {
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
}

async function createUser(
  req: Request<{}, {}, IUserRequestBody>,
  res: Response
) {
  try {
    console.log('req body in createUser', req.body);

    const user = await db.createUser(req.body);
    if (!user) {
      res.status(400).json({ error: 'User already exists' });
    }

    res.status(201).json(user);
  } catch (error) {
    console.error('createUser error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export { getAllUsers, createUser };
