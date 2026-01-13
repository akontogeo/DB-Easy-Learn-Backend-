import express from 'express';
import * as courseCtrl from '../controllers/courseController.js';
import { authenticate } from '../middleware/authenticate.js';
import { teacherAuth, verifyCourseOwnership } from '../middleware/auth.js';
import { requireBodyFields, requireNonEmptyBodyFields } from '../middleware/validation.js';

import ratingsRouter from './ratings.js';
import lessonsRouter from './lessons.js';
import quizzesRouter from './quizzes.js';

const router = express.Router();

/**
 * PUBLIC
 */

// List courses (public)
router.get('/', courseCtrl.listCourses);

// Get course (public)
router.get('/:courseId', courseCtrl.getCourse);

// Nested ratings (public)
router.use('/:courseId/reviews', ratingsRouter);

// Nested lessons (public GET, teacher protected for mutations inside lessonsRouter)
router.use('/:courseId/lessons', lessonsRouter);

// Nested quizzes (same logic)
router.use('/:courseId/quizzes', quizzesRouter);

/**
 * TEACHER ONLY (JWT required)
 */

// Create course (teacher)
router.post(
  '/',
  authenticate,
  teacherAuth,
  requireBodyFields(['course_title', 'course_description', 'category_id']),
  requireNonEmptyBodyFields(['course_title', 'course_description', 'category_id']),
  courseCtrl.addCourse
);

// Update course (teacher + ownership)
router.put(
  '/:courseId',
  authenticate,
  teacherAuth,
  verifyCourseOwnership,
  courseCtrl.editCourse
);

// Delete course (teacher + ownership)
router.delete(
  '/:courseId',
  authenticate,
  teacherAuth,
  verifyCourseOwnership,
  courseCtrl.removeCourse
);

export default router;
