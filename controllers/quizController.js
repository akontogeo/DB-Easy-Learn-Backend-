import { QuizService } from '../services/quizService.js';
import { successResponse, errorResponse } from '../utils/responses.js';

function validateQuizPayload(payload) {
  const emptyFields = [];
  if (!payload?.quiz_title || String(payload.quiz_title).trim() === '') emptyFields.push('quiz_title');

  const questions = payload?.questions;
  if (!Array.isArray(questions) || questions.length === 0) emptyFields.push('questions');

  const issues = [];

  if (Array.isArray(questions)) {
    questions.forEach((q, qi) => {
      if (!q?.question_text || String(q.question_text).trim() === '') {
        issues.push(`questions[${qi}].question_text`);
      }

      // ✅ points must exist and be >= 0 (ή >=1 αν θες)
      // Αν θες default 1, άστο να περνάει και θα το συμπληρώσει το service.
      if (q?.question_points === undefined || q?.question_points === null || String(q.question_points).trim() === '') {
        issues.push(`questions[${qi}].question_points (required)`);
      } else {
        const pts = Number(q.question_points);
        if (!Number.isFinite(pts) || pts < 0) {
          issues.push(`questions[${qi}].question_points (must be >= 0)`);
        }
      }

      if (!Array.isArray(q?.answers) || q.answers.length < 2) {
        issues.push(`questions[${qi}].answers (min 2)`);
      } else {
        const correctCount = q.answers.filter(a => a?.is_correct === true).length;
        if (correctCount !== 1) {
          issues.push(`questions[${qi}].answers (exactly 1 correct)`);
        }

        q.answers.forEach((a, ai) => {
          if (!a?.answer_text || String(a.answer_text).trim() === '') {
            issues.push(`questions[${qi}].answers[${ai}].answer_text`);
          }
        });
      }
    });
  }

  return { emptyFields, issues };
}

export async function listQuizzes(req, res, next) {
  try {
    const { courseId } = req.params;
    const quizzes = await QuizService.listByCourse(courseId);
    return res.json(successResponse(quizzes, 'Quizzes retrieved'));
  } catch (err) {
    next(err);
  }
}

export async function getQuiz(req, res, next) {
  try {
    const { courseId, quizId } = req.params;
    const includeCorrect = Boolean(req.authenticatedTeacherId);

    const quiz = await QuizService.getQuizWithQuestions(courseId, quizId, { includeCorrect });
    if (!quiz) return res.status(404).json(errorResponse('Not found', 'Quiz not found'));

    return res.json(successResponse(quiz, 'Quiz retrieved'));
  } catch (err) {
    next(err);
  }
}

export async function createQuiz(req, res, next) {
  try {
    const payload = req.body;

    const { emptyFields, issues } = validateQuizPayload(payload);
    if (emptyFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'There are empty fields',
        data: { emptyFields }
      });
    }
    if (issues.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Quiz payload is invalid',
        data: { issues }
      });
    }

    const created = await QuizService.createQuizWithQuestions(req.params.courseId, payload);
    return res.status(201).json(successResponse(created, 'Quiz created'));
  } catch (err) {
    next(err);
  }
}

export async function updateQuiz(req, res, next) {
  try {
    const payload = req.body;

    const { emptyFields, issues } = validateQuizPayload(payload);
    if (emptyFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'There are empty fields',
        data: { emptyFields }
      });
    }
    if (issues.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Quiz payload is invalid',
        data: { issues }
      });
    }

    const updated = await QuizService.updateQuizReplaceAll(req.params.courseId, req.params.quizId, payload);
    if (!updated) return res.status(404).json(errorResponse('Not found', 'Quiz not found'));

    return res.json(successResponse(updated, 'Quiz updated'));
  } catch (err) {
    next(err);
  }
}

export async function deleteQuiz(req, res, next) {
  try {
    const deleted = await QuizService.removeQuiz(req.params.courseId, req.params.quizId);
    if (!deleted) return res.status(404).json(errorResponse('Not found', 'Quiz not found'));
    return res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function submitQuiz(req, res, next) {
  try {
    const { courseId, quizId } = req.params;
    const { student_id, answers } = req.body;

    if (!student_id || !answers) {
      return res.status(400).json(errorResponse('Bad request', 'student_id and answers are required'));
    }

    const result = await QuizService.submitQuiz(courseId, quizId, student_id, answers);
    if (!result) return res.status(500).json(errorResponse('Error', 'Failed to submit quiz'));

    return res.json(successResponse(result, 'Quiz submitted'));
  } catch (err) {
    next(err);
  }
}
