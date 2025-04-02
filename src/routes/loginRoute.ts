import * as loginController from '../controllers/loginController.js';
import { Router } from 'express';
import { IReqUser } from '../types/request.js';
const router = Router();

router.route('/').post(...loginController.loginUser);

export default router;
