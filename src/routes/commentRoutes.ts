import { Router } from 'express';
import * as commentController from '../controllers/commentController.js';
const commentRoutes = Router();
commentRoutes
  .route('/')
  .get(commentController.getAllComments)
  .post(commentController.createComment);
export default commentRoutes;
