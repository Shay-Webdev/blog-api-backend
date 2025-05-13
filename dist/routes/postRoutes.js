import { Router } from 'express';
import * as postController from '../controllers/postController.js';
import { customJwtAuth } from '../authentication/customAuthError.js';
const postRoutes = Router();
postRoutes
    .route('/')
    .get(customJwtAuth, postController.getAllPosts)
    .post(customJwtAuth, postController.createPost);
postRoutes.route('/:postId').get(customJwtAuth, postController.getPostById);
postRoutes.route('/:postId').put(customJwtAuth, postController.updatePostById);
postRoutes
    .route('/:postId')
    .delete(customJwtAuth, postController.deletePostById);
postRoutes
    .route('/:userId/posts')
    .get(customJwtAuth, postController.getAllPostsByUser);
export default postRoutes;
//# sourceMappingURL=postRoutes.js.map