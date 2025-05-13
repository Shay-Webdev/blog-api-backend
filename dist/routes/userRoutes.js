import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { customJwtAuth } from '../authentication/customAuthError.js';
const userRoutes = Router();
userRoutes
    .route('/')
    .get(customJwtAuth, userController.getAllUsers)
    .post(userController.createUser);
userRoutes.route('/:userId').get(customJwtAuth, userController.getUserById);
userRoutes.route('/:userId').put(customJwtAuth, userController.updateUser);
userRoutes
    .route('/author/:userId')
    .put(customJwtAuth, userController.getUserDetails);
export default userRoutes;
//# sourceMappingURL=userRoutes.js.map