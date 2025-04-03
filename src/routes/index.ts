import { Router } from 'express';
import postRoutes from './postRoutes.js';
import userRoutes from './userRoutes.js';
import commentRoutes from './commentRoutes.js';
import signupRoute from './signupRoute.js';
import loginRoute from './loginRoute.js';
const router = Router();

router.use('/posts', postRoutes);
router.use('/users', userRoutes);
router.use('/posts/:postId/comments', commentRoutes);
router.use('/signup', signupRoute);
router.use('/login', loginRoute);
export default router;
