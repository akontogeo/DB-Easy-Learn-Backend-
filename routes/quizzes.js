import express from 'express';
import * as quizCtrl from '../controllers/quizController.js';
import { authenticate } from '../middleware/authenticate.js';
import { teacherAuth, studentAuth, verifyCourseOwnership } from '../middleware/auth.js';

const router = express.Router({ mergeParams: true });

// STUDENTS (JWT required)
router.get('/', authenticate, studentAuth, quizCtrl.listQuizzes);
router.get('/:quizId', authenticate, studentAuth, quizCtrl.getQuiz);
router.post('/:quizId/submit', authenticate, studentAuth, quizCtrl.submitQuiz);

// TEACHER ONLY (must own the course)
router.get('/:quizId/teacher', authenticate, teacherAuth, verifyCourseOwnership, quizCtrl.getQuiz);
router.post('/', authenticate, teacherAuth, verifyCourseOwnership, quizCtrl.createQuiz);
router.put('/:quizId', authenticate, teacherAuth, verifyCourseOwnership, quizCtrl.updateQuiz);
router.delete('/:quizId', authenticate, teacherAuth, verifyCourseOwnership, quizCtrl.deleteQuiz);

export default router;
