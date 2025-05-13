import * as db from "../models/queries.js";
import { AppError } from "../models/errors.js";
import { sendSuccess } from "../utils/response.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
const getAllPostsByUser = asyncHandler(async function (req, res, next) {
    if (!req.user) {
        throw new AppError("Authentication required", 401, "unauthorized");
    }
    const user = req.user;
    const userId = Number(user.sub);
    const posts = await db.getAllPostsByUserId(userId);
    if (!posts) {
        throw new AppError("Resource or Route not found", 404, "not_found");
    }
    sendSuccess(res, posts, 200, "Posts fetched successfully");
});
const getAllPosts = asyncHandler(async function (req, res, next) {
    if (!req.user) {
        throw new AppError("Authentication required", 401, "unauthorized");
    }
    const posts = await db.getAllPosts();
    if (!posts) {
        throw new AppError("Resource or Route not found", 404, "not_found");
    }
    sendSuccess(res, posts, 200, "Posts fetched successfully");
});
const getPostById = asyncHandler(async function (req, res, next) {
    if (!req.user) {
        throw new AppError("Authentication required", 401, "unauthorized");
    }
    const postId = Number(req.params.postId);
    const post = await db.getPostById(postId);
    if (!post) {
        throw new AppError("Resource or Route not found", 404, "not_found");
    }
    sendSuccess(res, post, 200, "Post fetched successfully");
});
const createPost = asyncHandler(async function (req, res, next) {
    if (!req.user) {
        throw new AppError("Authentication required", 401, "unauthorized");
    }
    if (!req.user.isAuthor) {
        throw new AppError("Access denied", 401, "unauthorized");
    }
    const post = req.body;
    const reqUser = req.user;
    console.log(`req user in post controller: `, req.user);
    const authorId = Number(reqUser.sub);
    const parsedPost = {
        authorId,
        content: post.content,
        title: post.title,
    };
    console.log("parsed post from req in pos controller: ", parsedPost);
    const user = await db.getUserById(authorId);
    if (!user) {
        throw new AppError("Resource or Route not found", 404, "not_found");
    }
    const createdPost = await db.createPostByAuthorId(parsedPost);
    sendSuccess(res, createdPost, 201, "Post created successfully");
});
const updatePostById = asyncHandler(async function (req, res, next) {
    if (!req.user) {
        throw new AppError("Authentication required", 401, "unauthorized");
    }
    if (!req.user.isAuthor) {
        throw new AppError("Access denied", 401, "unauthorized");
    }
    const postId = Number(req.params.postId);
    const updatePostContent = req.body;
    const updatePostReq = {
        id: postId,
        title: updatePostContent.title,
        content: updatePostContent.content,
    };
    const userId = Number(req.user.id);
    const userPosts = await db.getAllPostsByUserId(userId);
    const post = await db.getPostById(postId);
    if (userPosts.find((post) => post.id === postId)) {
        throw new AppError("Access denied", 401, "unauthorized");
    }
    else if (post?.authorId !== userId) {
        throw new AppError("Access denied", 401, "unauthorized");
    }
    const updatePost = await db.updatePostById(updatePostReq);
    return updatePost;
});
const deletePostById = asyncHandler(async function (req, res, next) {
    if (!req.user) {
        throw new AppError("Authentication required", 401, "unauthorized");
    }
    if (!req.user.isAuthor) {
        throw new AppError("Access denied", 401, "unauthorized");
    }
    const postId = Number(req.params.postId);
    const userId = Number(req.user.id);
    const userPosts = await db.getAllPostsByUserId(userId);
    const post = await db.getPostById(postId);
    if (userPosts.find((post) => post.id === postId)) {
        throw new AppError("Access denied", 401, "unauthorized");
    }
    else if (post?.authorId !== userId) {
        throw new AppError("Access denied", 401, "unauthorized");
    }
    const deletedPost = await db.deletePostById(postId);
    return deletedPost;
});
export { getAllPosts, createPost, getAllPostsByUser, getPostById, updatePostById, deletePostById, };
//# sourceMappingURL=postController.js.map