import { isDbConnected, getSequelize } from '../config/database.js';
import getQuizModel from '../models/Quiz.js';
import getQuestionModel from '../models/Question.js';
import getAnswerModel from '../models/Answer.js';
import getQuizAttemptModel from '../models/QuizAttempt.js';

export const QuizService = {
  async listByCourse(courseId) {
    if (!isDbConnected()) return [];

    const Quiz = getQuizModel();
    const quizzes = await Quiz.findAll({
      where: { course_id: Number(courseId) },
      order: [['quiz_id', 'ASC']]
    });

    return quizzes.map(q => q.toJSON());
  },

  async getQuizWithQuestions(courseId, quizId, { includeCorrect = false } = {}) {
    if (!isDbConnected()) return null;

    const Quiz = getQuizModel();
    const Question = getQuestionModel();
    const Answer = getAnswerModel();

    const quiz = await Quiz.findOne({
      where: { quiz_id: Number(quizId) }
    });
    if (!quiz) return null;

    const questions = await Question.findAll({
      where: { quiz_id: Number(quizId) },
      order: [['question_number', 'ASC']]
    });

    const questionsWithAnswers = [];
    for (const q of questions) {
      const answers = await Answer.findAll({
        where: {
          quiz_id: Number(quizId),
          question_number: q.question_number
        },
        order: [['answer_number', 'ASC']]
      });

      const cleanAnswers = answers.map(a => {
        const obj = a.toJSON();
        if (!includeCorrect) delete obj.is_correct;
        return obj;
      });

      questionsWithAnswers.push({
        ...q.toJSON(),
        answers: cleanAnswers
      });
    }

    return {
      ...quiz.toJSON(),
      questions: questionsWithAnswers
    };
  },

  /**
   * Teacher: create quiz + questions + answers
   */
  async createQuizWithQuestions(courseId, payload) {
    if (!isDbConnected()) return null;

    const sequelize = getSequelize();
    const Quiz = getQuizModel();
    const Question = getQuestionModel();
    const Answer = getAnswerModel();

    return sequelize.transaction(async (t) => {
      // create quiz
      const createdQuiz = await Quiz.create(
        {
          course_id: Number(courseId),
          quiz_title: payload.quiz_title
        },
        { transaction: t }
      );

      // create questions + answers
      for (let i = 0; i < payload.questions.length; i++) {
        const q = payload.questions[i];
        const pts = Number(q.question_points);
        const safePoints = Number.isFinite(pts) ? pts : 1;
        const createdQuestion = await Question.create(
          {
            course_id: Number(courseId),
            quiz_id: createdQuiz.quiz_id,
            question_number: i + 1, // ✅ add question_number
            question_text: q.question_text,
            question_points: safePoints
          },
          { transaction: t }
        );

        for (let j = 0; j < q.answers.length; j++) {
          const a = q.answers[j];
          await Answer.create(
            {
              quiz_id: createdQuiz.quiz_id,
              question_number: createdQuestion.question_number,
              answer_number: j + 1,
              answer_text: a.answer_text,
              is_correct: Boolean(a.is_correct)
            },
            { transaction: t }
          );
        }
      }

      // return full quiz for teacher
      const full = await this.getQuizWithQuestions(courseId, createdQuiz.quiz_id, { includeCorrect: true });
      return full;
    });
  },

  /**
   * Teacher: update title and REPLACE all questions+answers
   */
  async updateQuizReplaceAll(courseId, quizId, payload) {
    if (!isDbConnected()) return null;

    const sequelize = getSequelize();
    const Quiz = getQuizModel();
    const Question = getQuestionModel();
    const Answer = getAnswerModel();

    return sequelize.transaction(async (t) => {
      const quiz = await Quiz.findOne({
        where: { course_id: Number(courseId), quiz_id: Number(quizId) },
        transaction: t
      });
      if (!quiz) return null;

      await Quiz.update(
        { quiz_title: payload.quiz_title },
        { where: { course_id: Number(courseId), quiz_id: Number(quizId) }, transaction: t }
      );

      // delete old answers -> questions
      await Answer.destroy({
        where: { quiz_id: Number(quizId) },
        transaction: t
      });
      await Question.destroy({
        where: { quiz_id: Number(quizId) },
        transaction: t
      });

      // recreate questions + answers
      for (let i = 0; i < payload.questions.length; i++) {
        const q = payload.questions[i];
        const pts = Number(q.question_points);
        const safePoints = Number.isFinite(pts) ? pts : 1;
        const createdQuestion = await Question.create(
          {
            course_id: Number(courseId),
            quiz_id: Number(quizId),
            question_number: i + 1, // ✅ add question_number
            question_text: q.question_text,
            question_points: safePoints
          },
          { transaction: t }
        );

        for (let j = 0; j < q.answers.length; j++) {
          const a = q.answers[j];
          await Answer.create(
            {
              quiz_id: Number(quizId),
              question_number: createdQuestion.question_number,
              answer_number: j + 1,
              answer_text: a.answer_text,
              is_correct: Boolean(a.is_correct)
            },
            { transaction: t }
          );
        }
      }

      const full = await this.getQuizWithQuestions(courseId, quizId, { includeCorrect: true });
      return full;
    });
  },

  /**
   * Teacher: delete quiz + questions + answers
   */
  async removeQuiz(courseId, quizId) {
    if (!isDbConnected()) return false;

    const sequelize = getSequelize();
    const Quiz = getQuizModel();
    const Question = getQuestionModel();
    const Answer = getAnswerModel();
    const QuizAttempt = getQuizAttemptModel();

    return sequelize.transaction(async (t) => {
      // attempts first (FK safety)
      await QuizAttempt.destroy({
        where: { quiz_id: Number(quizId) },
        transaction: t
      });

      await Answer.destroy({
        where: { quiz_id: Number(quizId) },
        transaction: t
      });

      await Question.destroy({
        where: { quiz_id: Number(quizId) },
        transaction: t
      });

      const deleted = await Quiz.destroy({
        where: { quiz_id: Number(quizId) },
        transaction: t
      });

      return deleted > 0;
    });
  },

  /**
   * Student submit (already existed)
   */
  async submitQuiz(courseId, quizId, studentId, answers) {
    if (!isDbConnected()) return null;

    const Question = getQuestionModel();
    const Answer = getAnswerModel();
    const QuizAttempt = getQuizAttemptModel();

    // Load all questions
    const questions = await Question.findAll({
      where: { quiz_id: Number(quizId) }
    });


    // answers is now an array of { question_number, answer_number }
    // Convert to map for easier lookup
    const answersMap = {};
    if (Array.isArray(answers)) {
      for (const a of answers) {
        answersMap[a.question_number] = a.answer_number;
      }
    }

    let score = 0;
    for (const q of questions) {
      const correctAnswer = await Answer.findOne({
        where: {
          quiz_id: Number(quizId),
          question_number: q.question_number,
          is_correct: true
        }
      });

      const selected = answersMap[q.question_number];
      if (correctAnswer && Number(selected) === Number(correctAnswer.answer_number)) {
        score += Number(q.question_points);
      }
    }

    const createdAttempt = await QuizAttempt.create({
      student_id: Number(studentId),
      course_id: Number(courseId),
      quiz_id: Number(quizId),
      total_points: score,
      attempt_date: new Date()
    });

    return {
      attempt: createdAttempt.toJSON(),
      totalPoints: score
    };
  }
};
