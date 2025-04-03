import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import passport from 'passport';
import { customJwtAuth } from '../authentication/customAuthError.js';
const userRoutes = Router();

userRoutes
  .route('/')
  .get(customJwtAuth, userController.getAllUsers)
  .post(userController.createUser);

export default userRoutes;
