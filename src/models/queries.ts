import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import { TComment, TPost, TUser } from '../types/types.js';
import { title } from 'process';
const prisma = new PrismaClient();

async function getAllPosts(): Promise<TPost[]> {
  const posts = await prisma.post.findMany();
  return posts;
}

async function getAllUsers(): Promise<TUser[]> {
  const users = await prisma.user.findMany();
  return users;
}

async function getAllComments(): Promise<TComment[]> {
  const comments = await prisma.comment.findMany();
  return comments;
}

async function getUserById(id: number): Promise<TUser | null> {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  return user;
}

async function getPostById(id: number): Promise<TPost | null> {
  const post = await prisma.post.findUnique({
    where: {
      id: id,
    },
  });
  return post;
}

async function getCommentById(id: number): Promise<TComment | null> {
  const comment = await prisma.comment.findUnique({
    where: {
      id: id,
    },
  });

  return comment;
}

async function createUser(
  user: Pick<TUser, 'username' | 'email' | 'password'>
): Promise<TUser> {
  const newUser = await prisma.user.create({
    data: {
      username: user.username,
      email: user.email,
      password: user.password,
    },
  });

  return newUser;
}

async function makeAuthor(userId: number): Promise<TUser> {
  const author = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      isAuthor: true,
    },
  });
  return author;
}
async function createPostByAuthorId(
  post: Pick<TPost, 'title' | 'content' | 'authorId'>
): Promise<TPost | null> {
  const newPost = await prisma.post.create({
    data: {
      title: post.title,
      content: post.content,
      authorId: post.authorId,
    },
  });
  return newPost;
}

async function uploadPostById(postId: number): Promise<TPost> {
  const postedPost = await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      isPublished: true,
    },
  });
  return postedPost;
}

async function createCommentByPostId(
  comment: Pick<TComment, 'content' | 'postId' | 'userId'>
): Promise<TComment> {
  const newComment = await prisma.comment.create({
    data: {
      content: comment.content,
      postId: comment.postId,
      userId: comment.userId,
    },
  });
  return newComment;
}

async function postCommentById(commentId: number): Promise<TComment> {
  const postedComment = await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      isPosted: true,
    },
  });
  return postedComment;
}
export {
  getAllPosts,
  getAllUsers,
  getAllComments,
  getUserById,
  getPostById,
  getCommentById,
  createUser,
  createPostByAuthorId,
  createCommentByPostId,
  makeAuthor,
  uploadPostById,
  postCommentById,
};
