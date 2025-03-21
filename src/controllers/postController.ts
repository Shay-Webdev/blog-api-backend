import * as db from '../models/queries.js';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../models/errors.js';
import { sendSuccess } from '../utils/response.js';
import { TPost, TUser } from '../types/types.js';

async function getAllPosts(
  req: Request<{}, {}, Omit<TUser, 'password'>>,
  res: Response,
  next: NextFunction
) {
  const userId: number = req.body.id;
  const posts = await db.getAllPosts(userId);
  if (!posts) {
    throw new AppError('No posts found', 404);
  }
  sendSuccess(res, posts, 200, 'Posts fetched successfully');
}

async function createPost(
  req: Request<{}, {}, Pick<TPost, 'title' | 'content' | 'authorId'>>,
  res: Response<TPost>,
  next: NextFunction
) {
  const post = req.body;

  const authorId: number = Number(post.authorId);
  const parsedPost: Pick<TPost, 'title' | 'content' | 'authorId'> = {
    authorId,
    content: post.content,
    title: post.title,
  };

  console.log(
    'type of post elements',
    typeof parsedPost.title,
    typeof parsedPost.content,
    typeof parsedPost.authorId
  );
  const user = await db.getUserById(authorId);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  const createdPost = await db.createPostByAuthorId(parsedPost);

  sendSuccess(res, createdPost, 201, 'Post created successfully');
}
export { getAllPosts, createPost };
