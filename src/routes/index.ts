import { Router } from 'express';
import postRoutes from './postRoutes.js';
import userRoutes from './userRoutes.js';
import commentRoutes from './commentRoutes.js';
import signupRoute from './signupRoute.js';
const router = Router();

router.use('/posts', postRoutes);
router.use('/users', userRoutes);
router.use('/comments', commentRoutes);
router.use('/signup', signupRoute);
export default router;
