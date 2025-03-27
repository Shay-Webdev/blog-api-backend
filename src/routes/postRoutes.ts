import { Router } from 'express';
import * as db from '../models/queries.js';
import * as postController from '../controllers/postController.js';

const postRoutes = Router();
postRoutes
  .route('/')
  .get(postController.getAllPosts)
  .post(postController.createPost);

export default postRoutes;
