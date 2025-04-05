import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import { IRefreshToken, TComment, TPost, TUser } from '../types/types.js';
import { handleDbError } from '../utils/dbErrorHandler.js';
import { NotFoundError, ValidationError } from './errors.js';

const prisma = new PrismaClient();

async function getAllPosts(): Promise<TPost[]> {
  try {
    const posts = await prisma.post.findMany({});
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

async function getUserById(id: number) {
  try {
    const user = await prisma.user.findUnique({ where: { id } });

    return user;
  } catch (error) {
    handleDbError(error, 'User');
  }
}

async function getUserByEmail(email: string) {
  try {
    const user = (await prisma.user.findUnique({ where: { email } })) as TUser;
    // if (!user) {
    //   throw new NotFoundError();
    // }
    return user;
  } catch (error) {
    handleDbError(error, 'User');
  }
}

async function getPostById(id: number) {
  try {
    const post = await prisma.post.findUnique({ where: { id } });

    return post;
  } catch (error) {
    handleDbError(error, 'Post');
  }
}

async function getCommentById(id: number) {
  try {
    const comment = await prisma.comment.findUnique({ where: { id } });

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
      throw new NotFoundError();
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
      throw new NotFoundError();
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
      throw new NotFoundError();
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
      throw new NotFoundError();
    }
    return await prisma.comment.update({
      where: { id: commentId },
      data: { isPosted: true },
    });
  } catch (error) {
    handleDbError(error, 'Comment');
  }
}
// updates

const updateCommentById = async (
  commentReq: Pick<TComment, 'content' | 'id'>
) => {
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentReq.id },
    });
    if (!comment) {
      throw new NotFoundError();
    }
    return await prisma.comment.update({
      where: { id: commentReq.id },
      data: { content: comment.content },
    });
  } catch (error) {
    handleDbError(error, 'Comment');
  }
};

const updatePostById = async (
  postReq: Pick<TPost, 'title' | 'content' | 'id'>
) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: postReq.id },
    });
    if (!post) {
      throw new NotFoundError();
    }
    return await prisma.post.update({
      where: { id: postReq.id },
      data: { title: post.title, content: post.content },
    });
  } catch (error) {
    handleDbError(error, 'Post');
  }
};

// deletes

const deleteCommentById = async (commentId: number) => {
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (!comment) {
      throw new NotFoundError();
    }
    return await prisma.comment.delete({
      where: { id: commentId },
    });
  } catch (error) {
    handleDbError(error, 'Comment');
  }
};

const deletePostById = async (postId: number) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });
    if (!post) {
      throw new NotFoundError();
    }
    return await prisma.post.delete({
      where: { id: postId },
    });
  } catch (error) {
    handleDbError(error, 'Post');
  }
};

// all details

const getDetailsByUserId = async (userId: number) => {
  try {
    return await prisma.user.findUnique({
      where: { id: userId },
      include: {
        posts: true,
        comments: true,
      },
    });
  } catch (error) {
    handleDbError(error, 'User');
  }
};

const getAllCommentsByUserId = async (userId: number) => {
  try {
    return await prisma.comment.findMany({
      where: { userId },
    });
  } catch (error) {
    handleDbError(error, 'Comment');
  }
};

const getAllPostsByUserId = async (userId: number) => {
  try {
    return await prisma.post.findMany({
      where: { authorId: userId },
    });
  } catch (error) {
    handleDbError(error, 'Post');
  }
};

const createRefreshToken = async (
  refreshToken: Pick<IRefreshToken, 'userId' | 'token' | 'expiresAt'>
) => {
  try {
    return await prisma.refreshTokens.create({
      data: {
        userId: refreshToken.userId,
        token: refreshToken.token,
        expiresAt: refreshToken.expiresAt,
      },
    });
  } catch (error) {
    handleDbError(error, 'RefreshToken');
  }
};

const getRefreshToken = async (refreshToken: string) => {
  try {
    return await prisma.refreshTokens.findUnique({
      where: { token: refreshToken },
    });
  } catch (error) {
    handleDbError(error, 'RefreshToken');
  }
};

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
  updateCommentById,
  updatePostById,
  deleteCommentById,
  deletePostById,
  getDetailsByUserId,
  getAllCommentsByUserId,
  getAllPostsByUserId,
  createRefreshToken,
  getRefreshToken,
};
