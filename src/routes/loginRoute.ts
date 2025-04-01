import * as loginController from '../controllers/loginController.js';
import { Router } from 'express';

const router = Router();

router.route('/').post(...loginController.loginUser);

export default router;
