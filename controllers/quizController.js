import { QuizService } from '../services/quizService.js';
import { successResponse, errorResponse } from '../utils/responses.js';

/**
 * List all quizzes for a course
 */
export async function listQuizzes(req, res, next) {
  try {
    const { courseId } = req.params;
    const quizzes = await QuizService.listByCourse(courseId);
    res.json(successResponse(quizzes, 'Quizzes retrieved'));
  } catch (err) {
    next(err);
  }
}

/**
 * Get quiz details with questions (without showing correct answers)
 */
export async function getQuiz(req, res, next) {
  try {
    const { courseId, quizId } = req.params;
    const quiz = await QuizService.getQuiz(courseId, quizId);
    
    if (!quiz) {
      return res.status(404).json(errorResponse('Not found', 'Quiz not found'));
    }
    
    // Hide correct answers from response - only show answer options
    const quizForStudent = {
      quiz_id: quiz.quiz_id,
      quiz_title: quiz.quiz_title,
      course_id: quiz.course_id,
      questions: (quiz.questions || []).map(q => ({
        question_number: q.question_number,
        question_text: q.question_text,
        question_points: q.question_points,
        answers: q.answers.map(a => ({
          answer_number: a.answer_number,
          answer_text: a.answer_text
          // is_correct is hidden
        }))
      }))
    };
    
    res.json(successResponse(quizForStudent, 'Quiz retrieved'));
  } catch (err) {
    next(err);
  }
}

/**
 * Submit quiz answers and get grading results
 */
export async function submitQuiz(req, res, next) {
  try {
    const { courseId, quizId } = req.params;
    const submission = req.body;
    
    const result = await QuizService.submitAnswers(courseId, quizId, submission);
    
    if (!result) {
      return res.status(404).json(errorResponse('Not found', 'Quiz not found'));
    }
    
    res.json(successResponse(result, 'Quiz graded'));
  } catch (err) {
    next(err);
  }
}
