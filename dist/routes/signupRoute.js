import { Router } from 'express';
const signupRoute = Router();
import * as signupController from '../controllers/signupController.js';
signupRoute.post('/', ...signupController.createUser);
export default signupRoute;
//# sourceMappingURL=signupRoute.js.map