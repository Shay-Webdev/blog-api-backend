import { Router } from 'express';
import * as commentController from '../controllers/commentController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
const commentRoutes = Router();
commentRoutes
  .route('/')
  .get(asyncHandler(commentController.getAllComments))
  .post(asyncHandler(commentController.createComment));
export default commentRoutes;
