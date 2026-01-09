import express from 'express';
import * as quizCtrl from '../controllers/quizController.js';
import { requireBodyFields } from '../middleware/validation.js';

// mergeParams allows access to :courseId from parent route
const router = express.Router({ mergeParams: true });

/**
 * Quiz routes (nested under /courses/:courseId/quizzes)
 * GET  /courses/:courseId/quizzes        - List all quizzes for course
 * GET  /courses/:courseId/quizzes/:quizId - Get specific quiz with questions
 * POST /courses/:courseId/quizzes/:quizId/submit - Submit quiz answers
 */

router.get('/', quizCtrl.listQuizzes);
router.get('/:quizId', quizCtrl.getQuiz);
router.post('/:quizId/submit', requireBodyFields(['userId','answers']), quizCtrl.submitQuiz);

export default router;
