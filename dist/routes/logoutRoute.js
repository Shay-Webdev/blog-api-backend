import { customJwtAuth } from '../authentication/customAuthError.js';
import * as logoutControllers from '../controllers/logoutController.js';
import { Router } from 'express';
const router = Router();
router.route('/').delete(customJwtAuth, logoutControllers.logout);
export default router;
//# sourceMappingURL=logoutRoute.js.map