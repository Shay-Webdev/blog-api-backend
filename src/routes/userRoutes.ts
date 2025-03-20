import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
const userRoutes = Router();

userRoutes
  .route('/')
  .get(asyncHandler(userController.getAllUsers))
  .post(asyncHandler(userController.createUser));

export default userRoutes;
