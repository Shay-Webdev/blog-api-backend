import { Router } from 'express';
import * as tokenController from '../controllers/tokenController.js';
const router = Router();

router.route('/refresh').get(tokenController.refreshToken);

export default router;
