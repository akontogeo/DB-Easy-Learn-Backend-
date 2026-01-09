import express from 'express';
import * as lessonCtrl from '../controllers/lessonController.js';
import { basicAuth } from '../middleware/auth.js';
import { requireBodyFields } from '../middleware/validation.js';

// mergeParams allows access to :courseId from parent route
const router = express.Router({ mergeParams: true });

/**
 * Lesson routes (nested under /courses/:courseId/lessons)
 * GET    /courses/:courseId/lessons           - List all lessons
 * GET    /courses/:courseId/lessons/:lessonTitle - Get specific lesson
 * POST   /courses/:courseId/lessons           - Create lesson (admin)
 * PUT    /courses/:courseId/lessons/:lessonTitle - Update lesson (admin)
 * DELETE /courses/:courseId/lessons/:lessonTitle - Delete lesson (admin)
 */

router.get('/', lessonCtrl.listLessons);
router.get('/:lessonTitle', lessonCtrl.getLesson);
router.post('/', basicAuth, requireBodyFields(['lesson_title']), lessonCtrl.createLesson);
router.put('/:lessonTitle', basicAuth, lessonCtrl.updateLesson);
router.delete('/:lessonTitle', basicAuth, lessonCtrl.deleteLesson);

export default router;
