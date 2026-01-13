import express from 'express';
import * as quizCtrl from '../controllers/quizController.js';
import { authenticate } from '../middleware/authenticate.js';
import { teacherAuth, verifyCourseOwnership } from '../middleware/auth.js';

const router = express.Router({ mergeParams: true });

// PUBLIC (students)
router.get('/', quizCtrl.listQuizzes);
router.get('/:quizId', quizCtrl.getQuiz);
router.post('/:quizId/submit', quizCtrl.submitQuiz);

// TEACHER ONLY (must own the course)
router.get('/:quizId/teacher', authenticate, teacherAuth, verifyCourseOwnership, quizCtrl.getQuiz);
router.post('/', authenticate, teacherAuth, verifyCourseOwnership, quizCtrl.createQuiz);
router.put('/:quizId', authenticate, teacherAuth, verifyCourseOwnership, quizCtrl.updateQuiz);
router.delete('/:quizId', authenticate, teacherAuth, verifyCourseOwnership, quizCtrl.deleteQuiz);

export default router;
