import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import { TComment, TPost, TUser } from '../types/types.js';
import { handleDbError } from '../utils/dbErrorHandler.js';
import { NotFoundError, ValidationError } from './errors.js';

const prisma = new PrismaClient();

async function getAllPosts(userId: number): Promise<TPost[]> {
  try {
    const posts = await prisma.post.findMany({
      where: { authorId: userId },
    });
    return posts; // Empty array is fine if no posts exist
  } catch (error) {
    handleDbError(error, 'Posts');
  }
}

async function getAllUsers(): Promise<Omit<TUser, 'posts' | 'comments'>[]> {
  try {
    const users = await prisma.user.findMany();
    return users; // Empty array is fine
  } catch (error) {
    handleDbError(error, 'Users');
  }
}

async function getAllComments(): Promise<TComment[]> {
  try {
    const comments = await prisma.comment.findMany();
    return comments; // Empty array is fine
  } catch (error) {
    handleDbError(error, 'Comments');
  }
}

async function getUserById(
  id: number
): Promise<Omit<TUser, 'posts' | 'comments'>> {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundError('User');
    }
    return user;
  } catch (error) {
    handleDbError(error, 'User');
  }
}

async function getUserByEmail(email: string): Promise<TUser> {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundError('User');
    }
    return user;
  } catch (error) {
    handleDbError(error, 'User');
  }
}

async function getPostById(id: number): Promise<TPost> {
  try {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundError('Post');
    }
    return post;
  } catch (error) {
    handleDbError(error, 'Post');
  }
}

async function getCommentById(id: number): Promise<TComment> {
  try {
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) {
      throw new NotFoundError('Comment');
    }
    return comment;
  } catch (error) {
    handleDbError(error, 'Comment');
  }
}

async function createUser(user: Omit<TUser, 'id'>): Promise<TUser> {
  try {
    return await prisma.user.create({
      data: {
        username: user.username,
        email: user.email,
        password: user.password,
        isAuthor: user.isAuthor ? user.isAuthor : false,
      },
    });
  } catch (error) {
    handleDbError(error, 'User');
  }
}

async function makeAuthor(userId: number): Promise<TUser> {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError('User');
    }
    return await prisma.user.update({
      where: { id: userId },
      data: { isAuthor: true },
    });
  } catch (error) {
    handleDbError(error, 'User');
  }
}

async function createPostByAuthorId(
  post: Pick<TPost, 'title' | 'content' | 'authorId'>
): Promise<TPost> {
  try {
    // Optional: Validate author exists and is an author
    // const author = await prisma.user.findUnique({
    //   where: { id: post.authorId },
    // });
    // if (!author || !author.isAuthor) {
    //   throw new ValidationError('Invalid author', 'INVALID_AUTHOR');
    // }
    return await prisma.post.create({
      data: {
        title: post.title,
        content: post.content,
        authorId: post.authorId,
      },
    });
  } catch (error) {
    handleDbError(error, 'Post');
  }
}

async function uploadPostById(postId: number): Promise<TPost> {
  try {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      throw new NotFoundError('Post');
    }
    return await prisma.post.update({
      where: { id: postId },
      data: { isPublished: true },
    });
  } catch (error) {
    handleDbError(error, 'Post');
  }
}

async function createCommentByPostId(
  comment: Pick<TComment, 'content' | 'postId' | 'userId'>
): Promise<TComment> {
  try {
    // Optional: Validate post exists
    const post = await prisma.post.findUnique({
      where: { id: comment.postId },
    });
    if (!post) {
      throw new NotFoundError('Post');
    }
    return await prisma.comment.create({
      data: {
        content: comment.content,
        postId: comment.postId,
        userId: comment.userId,
      },
    });
  } catch (error) {
    handleDbError(error, 'Comment');
  }
}

async function postCommentById(commentId: number): Promise<TComment> {
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (!comment) {
      throw new NotFoundError('Comment');
    }
    return await prisma.comment.update({
      where: { id: commentId },
      data: { isPosted: true },
    });
  } catch (error) {
    handleDbError(error, 'Comment');
  }
}

export {
  getAllPosts,
  getAllUsers,
  getAllComments,
  getUserById,
  getUserByEmail,
  getPostById,
  getCommentById,
  createUser,
  createPostByAuthorId,
  createCommentByPostId,
  makeAuthor,
  uploadPostById,
  postCommentById,
};
