import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
const userRoutes = Router();

userRoutes
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

export default userRoutes;
