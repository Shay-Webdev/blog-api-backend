import * as db from "../models/queries.js";
import { AppError } from "../models/errors.js";
import { sendSuccess } from "../utils/response.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
const getAllComments = asyncHandler(async function (req, res, next) {
    const postId = Number(req.params.postId);
    console.log(`postId param in get all comments: `, req.params);
    console.log(`url in get all comments: `, req.originalUrl);
    const comments = await db.getAllComments(postId);
    if (!comments) {
        throw new AppError("Resource or Route not found", 404, "not_found");
    }
    sendSuccess(res, comments, 200, "Comments fetched successfully");
});
const createComment = asyncHandler(async function (req, res, next) {
    if (!req.user) {
        throw new AppError("Authentication required", 401, "unauthorized");
    }
    console.log(`req user in create comments: `, req.user);
    const reqUser = req.user;
    const commentContent = req.body;
    const userId = Number(reqUser.sub);
    const postId = Number(req.params.postId);
    const comment = {
        content: commentContent.content,
        postId: postId,
        userId: userId,
    };
    const user = await db.getUserById(userId);
    if (!user) {
        throw new AppError("Resource or Route not found", 404, "not_found");
    }
    const post = await db.getPostById(postId);
    if (!post) {
        throw new AppError("Resource or Route not found", 404, "not_found");
    }
    const createdComment = await db.createCommentByPostId(comment);
    sendSuccess(res, createdComment, 201, "Comment created successfully");
});
const getCommentById = asyncHandler(async function (req, res, next) {
    if (!req.user) {
        throw new AppError("Authentication required", 401, "unauthorized");
    }
    if (!req.user.isAuthor) {
        throw new AppError("Access denied", 401, "unauthorized");
    }
    const commentId = Number(req.user.id);
    const comment = await db.getCommentById(commentId);
});
const updateComment = asyncHandler(async function (req, res, next) {
    if (!req.user) {
        throw new AppError("Authentication required", 401, "unauthorized");
    }
    if (!req.user.isAuthor) {
        throw new AppError("Access denied", 401, "unauthorized");
    }
    const commentId = Number(req.params.commentId);
    const updateCommentContent = req.body;
    const updateCommentReq = {
        id: commentId,
        content: updateCommentContent,
    };
    const userId = Number(req.user.id);
    const postId = Number(req.params.postId);
    const userComments = await db.getAllCommentsByUserId(userId);
    const comment = await db.getCommentById(commentId);
    if (userComments.find((comment) => comment.id === commentId)) {
        throw new AppError("Access denied", 401, "unauthorized");
    }
    else if (comment?.postId !== postId) {
        throw new AppError("Access denied", 401, "unauthorized");
    }
    const updateComment = await db.updateCommentById(updateCommentReq);
    return updateComment;
});
const deleteComment = asyncHandler(async function (req, res, next) {
    if (!req.user) {
        throw new AppError("Authentication required", 401, "unauthorized");
    }
    if (!req.user.isAuthor) {
        throw new AppError("Access denied", 401, "unauthorized");
    }
    const userId = Number(req.user.id);
    const postId = Number(req.params.postId);
    const commentId = Number(req.params.commentId);
    const userComments = await db.getAllCommentsByUserId(userId);
    const comment = await db.getCommentById(commentId);
    if (userComments.find((comment) => comment.id === commentId)) {
        throw new AppError("Access denied", 401, "unauthorized");
    }
    else if (comment?.postId !== postId) {
        throw new AppError("Access denied", 401, "unauthorized");
    }
    const deletedComment = await db.deleteCommentById(commentId);
    return deletedComment;
});
export { getAllComments, createComment, getCommentById, updateComment, deleteComment, };
//# sourceMappingURL=commentController.js.map