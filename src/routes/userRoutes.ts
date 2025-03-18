import { Router } from 'express';
import * as userController from '../controllers/userController.js';
const userRoutes = Router();

userRoutes
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

export default userRoutes;
