import express from 'express';
import * as courseCtrl from '../controllers/courseController.js';
import { basicAuth, teacherAuth, verifyCourseOwnership } from '../middleware/auth.js';
import { requireBodyFields } from '../middleware/validation.js';
import ratingsRouter from './ratings.js';
import lessonsRouter from './lessons.js';
import quizzesRouter from './quizzes.js';

const router = express.Router();

// Course CRUD routes (POST requires teacher auth, PUT/DELETE require teacher auth + ownership)
router.get('/', courseCtrl.listCourses);
router.post('/', teacherAuth, requireBodyFields(['title','description','category_id','teacher_id']), courseCtrl.addCourse);
router.get('/:courseId', courseCtrl.getCourse);
router.put('/:courseId', teacherAuth, verifyCourseOwnership, courseCtrl.editCourse);
router.delete('/:courseId', teacherAuth, verifyCourseOwnership, courseCtrl.removeCourse);

// Nested ratings routes
router.use('/:courseId/reviews', ratingsRouter);

// Nested lessons routes
router.use('/:courseId/lessons', lessonsRouter);

// Nested quizzes routes
router.use('/:courseId/quizzes', quizzesRouter);

export default router;
