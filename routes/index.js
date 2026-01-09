import express from 'express';
import userRoutes from './users.js';
import courseRoutes from './courses.js';
import quizRoutes from './quizzes.js';
import categoryRoutes from './categories.js';

const router = express.Router();

// Main API route definitions
router.use('/users', userRoutes);
router.use('/courses', courseRoutes);
router.use('/courses/:courseId/quizzes', quizRoutes);
router.use('/categories', categoryRoutes);

export default router;
