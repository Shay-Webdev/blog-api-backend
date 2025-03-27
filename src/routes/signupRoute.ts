import { Router } from 'express';
const signupRoute = Router();
import * as signupController from '../controllers/signupController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { signupValidation } from '../validation/signupValidation.js';

signupRoute.post(
  '/',
  signupValidation,
  asyncHandler(signupController.createUser)
);

export default signupRoute;
