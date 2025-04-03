import { Router } from 'express';
import * as commentController from '../controllers/commentController.js';
import { customJwtAuth } from '../authentication/customAuthError.js';
const commentRoutes = Router();
commentRoutes
  .route('/')
  .get(customJwtAuth, commentController.getAllComments)
  .post(customJwtAuth, commentController.createComment);
commentRoutes
  .route('/:commentId')
  .get(customJwtAuth, commentController.getCommentById);
commentRoutes
  .route('/:commentId')
  .put(customJwtAuth, commentController.updateComment);
commentRoutes
  .route('/:commentId')
  .delete(customJwtAuth, commentController.deleteComment);
export default commentRoutes;
