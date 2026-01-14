import express from 'express';
import * as lessonCtrl from '../controllers/lessonController.js';
import { authenticate } from '../middleware/authenticate.js';
import { teacherAuth, studentAuth, verifyCourseOwnership, studentOrTeacherAuth } from '../middleware/auth.js';
import { requireBodyFields, requireNonEmptyBodyFields } from '../middleware/validation.js';

const router = express.Router({ mergeParams: true });

/**
 * STUDENTS (JWT required)
 */
router.get('/', authenticate, studentOrTeacherAuth, lessonCtrl.listLessons);
router.get('/:lessonTitle', authenticate, studentOrTeacherAuth, lessonCtrl.getLesson);

/**
 * TEACHER ONLY (JWT + ownership)
 */
router.post(
  '/',
  authenticate,
  teacherAuth,
  verifyCourseOwnership,
  requireBodyFields(['lesson_title']),
  requireNonEmptyBodyFields(['lesson_title']),
  lessonCtrl.createLesson
);

router.put(
  '/:lessonTitle',
  authenticate,
  teacherAuth,
  verifyCourseOwnership,
  lessonCtrl.updateLesson
);

router.delete(
  '/:lessonTitle',
  authenticate,
  teacherAuth,
  verifyCourseOwnership,
  lessonCtrl.deleteLesson
);

export default router;
