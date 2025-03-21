import { Router } from 'express';
import * as db from '../models/queries.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import * as postController from '../controllers/postController.js';

const postRoutes = Router();
postRoutes
  .route('/')
  .get(asyncHandler(postController.getAllPosts))
  .post(asyncHandler(postController.createPost));

export default postRoutes;
