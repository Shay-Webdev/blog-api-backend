import { Router } from 'express';
import * as userController from '../controllers/userController.js';
const userRoutes = Router();

userRoutes.get('/', userController.getAllUsers);

export default userRoutes;
