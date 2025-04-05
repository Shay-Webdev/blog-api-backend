import * as loginController from '../controllers/loginController.js';
import { Router } from 'express';
import { IReqUser } from '../types/request.js';
import { customJwtAuth } from '../authentication/customAuthError.js';
const router = Router();

router.route('/').post(...loginController.loginUser);

export default router;
