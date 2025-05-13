import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import { handleDbError } from "../utils/dbErrorHandler.js";
import { NotFoundError } from "./errors.js";
const prisma = new PrismaClient();
async function getAllPosts() {
    try {
        const posts = await prisma.post.findMany({
            include: {
                author: {
                    select: {
                        username: true,
                    },
                },
            },
        });
        return posts; // Empty array is fine if no posts exist
    }
    catch (error) {
        handleDbError(error, "Posts");
    }
}
async function getAllUsers() {
    try {
        const users = await prisma.user.findMany();
        return users; // Empty array is fine
    }
    catch (error) {
        handleDbError(error, "Users");
    }
}
async function getAllComments(postId) {
    try {
        const comments = await prisma.comment.findMany({
            where: {
                postId,
            },
            include: {
                user: {
                    select: {
                        username: true,
                    },
                },
            },
        });
        return comments; // Empty array is fine
    }
    catch (error) {
        handleDbError(error, "Comments");
    }
}
async function getUserById(id) {
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        return user;
    }
    catch (error) {
        handleDbError(error, "User");
    }
}
async function getUserByEmail(email) {
    try {
        const user = (await prisma.user.findUnique({ where: { email } }));
        // if (!user) {
        //   throw new NotFoundError();
        // }
        return user;
    }
    catch (error) {
        handleDbError(error, "User");
    }
}
async function getPostById(id) {
    try {
        const post = await prisma.post.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        username: true,
                    },
                },
            },
        });
        return post;
    }
    catch (error) {
        handleDbError(error, "Post");
    }
}
async function getCommentById(id) {
    try {
        const comment = await prisma.comment.findUnique({ where: { id } });
        return comment;
    }
    catch (error) {
        handleDbError(error, "Comment");
    }
}
async function createUser(user) {
    try {
        return await prisma.user.create({
            data: {
                username: user.username,
                email: user.email,
                password: user.password,
                isAuthor: user.isAuthor ? user.isAuthor : false,
            },
        });
    }
    catch (error) {
        handleDbError(error, "User");
    }
}
async function makeAuthor(userId) {
    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new NotFoundError();
        }
        return await prisma.user.update({
            where: { id: userId },
            data: { isAuthor: true },
        });
    }
    catch (error) {
        handleDbError(error, "User");
    }
}
async function createPostByAuthorId(post) {
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
    }
    catch (error) {
        handleDbError(error, "Post");
    }
}
async function uploadPostById(postId) {
    try {
        const post = await prisma.post.findUnique({ where: { id: postId } });
        if (!post) {
            throw new NotFoundError();
        }
        return await prisma.post.update({
            where: { id: postId },
            data: { isPublished: true },
        });
    }
    catch (error) {
        handleDbError(error, "Post");
    }
}
async function createCommentByPostId(comment) {
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
    }
    catch (error) {
        handleDbError(error, "Comment");
    }
}
async function postCommentById(commentId) {
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
    }
    catch (error) {
        handleDbError(error, "Comment");
    }
}
// updates
const updateCommentById = async (commentReq) => {
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
    }
    catch (error) {
        handleDbError(error, "Comment");
    }
};
const updatePostById = async (postReq) => {
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
    }
    catch (error) {
        handleDbError(error, "Post");
    }
};
// deletes
const deleteCommentById = async (commentId) => {
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
    }
    catch (error) {
        handleDbError(error, "Comment");
    }
};
const deletePostById = async (postId) => {
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
    }
    catch (error) {
        handleDbError(error, "Post");
    }
};
// all details
const getDetailsByUserId = async (userId) => {
    try {
        return await prisma.user.findUnique({
            where: { id: userId },
            include: {
                posts: true,
                comments: true,
            },
        });
    }
    catch (error) {
        handleDbError(error, "User");
    }
};
const getAllCommentsByUserId = async (userId) => {
    try {
        return await prisma.comment.findMany({
            where: { userId },
        });
    }
    catch (error) {
        handleDbError(error, "Comment");
    }
};
const getAllPostsByUserId = async (userId) => {
    try {
        return await prisma.post.findMany({
            where: { authorId: userId },
        });
    }
    catch (error) {
        handleDbError(error, "Post");
    }
};
const createRefreshToken = async (refreshToken) => {
    try {
        return await prisma.refreshTokens.create({
            data: {
                userId: refreshToken.userId,
                token: refreshToken.token,
                expiresAt: refreshToken.expiresAt,
            },
        });
    }
    catch (error) {
        handleDbError(error, "RefreshToken");
    }
};
const getRefreshToken = async (refreshToken) => {
    try {
        return await prisma.refreshTokens.findUnique({
            where: { token: refreshToken },
        });
    }
    catch (error) {
        handleDbError(error, "RefreshToken");
    }
};
const getTokenByEmail = async (email) => {
    try {
        return await prisma.refreshTokens.findMany({
            where: {
                user: {
                    email: email,
                },
            },
        });
    }
    catch (error) {
        handleDbError(error, "RefreshToken");
    }
};
const deleteRefreshTokenByUserID = async (userId) => {
    try {
        return await prisma.refreshTokens.deleteMany({
            where: { userId: userId },
        });
    }
    catch (error) {
        handleDbError(error, "RefreshToken");
    }
};
const deleteExpiredTokens = async (expiryDate) => {
    try {
        return await prisma.refreshTokens.deleteMany({
            where: {
                expiresAt: { lte: expiryDate },
                revoked: false,
            },
        });
    }
    catch (error) {
        handleDbError(error, "RefreshToken");
    }
};
export { getAllPosts, getAllUsers, getAllComments, getUserById, getUserByEmail, getPostById, getCommentById, createUser, createPostByAuthorId, createCommentByPostId, makeAuthor, uploadPostById, postCommentById, updateCommentById, updatePostById, deleteCommentById, deletePostById, getDetailsByUserId, getAllCommentsByUserId, getAllPostsByUserId, createRefreshToken, getRefreshToken, deleteRefreshTokenByUserID, deleteExpiredTokens, getTokenByEmail, };
//# sourceMappingURL=queries.js.map