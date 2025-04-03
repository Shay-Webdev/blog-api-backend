import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import passport from 'passport';
const userRoutes = Router();

userRoutes
  .route('/')
  .get(
    passport.authenticate('jwt', { session: false }),
    userController.getAllUsers
  )
  .post(userController.createUser);

export default userRoutes;
