import { quizzes as mockQuizzes } from '../utils/mockData.js';
import getQuizModel from '../models/Quiz.js';
import getQuestionModel from '../models/Question.js';
import getAnswerModel from '../models/Answer.js';import getQuizAttemptModel from '../models/QuizAttempt.js';import { isDbConnected } from '../config/database.js';

/**
 * QuizService provides operations for quizzes.
 * Uses MariaDB if connected, otherwise falls back to in-memory mock data.
 */
export const QuizService = {
  /**
   * List all quizzes for a course.
   * @param {number} courseId - The course's ID
   * @returns {Promise<Array>} Array of quiz objects
   */
  async listByCourse(courseId) {
    if (isDbConnected()) {
      const QuizModel = getQuizModel();
      const quizzes = await QuizModel.findAll({
        where: { course_id: Number(courseId) },
        order: [['quiz_id', 'ASC']]
      });
      return quizzes.map(q => q.toJSON());
    }
    return mockQuizzes.filter(q => String(q.courseId) === String(courseId));
  },

  /**
   * Get a quiz with its questions and answers.
   * @param {number} courseId - The course's ID
   * @param {number} quizId - The quiz's ID
   * @returns {Promise<Object|null>} Quiz object with questions and answers
   */
  async getQuiz(courseId, quizId) {
    if (isDbConnected()) {
      const QuizModel = getQuizModel();
      const QuestionModel = getQuestionModel();
      const AnswerModel = getAnswerModel();
      
      // Get quiz
      const quiz = await QuizModel.findOne({ 
        where: { 
          quiz_id: Number(quizId),
          course_id: Number(courseId) 
        } 
      });
      
      if (!quiz) return null;
      
      const quizData = quiz.toJSON();
      
      // Get questions for this quiz
      const questions = await QuestionModel.findAll({
        where: { quiz_id: Number(quizId) },
        order: [['question_number', 'ASC']]
      });
      
      // Get all answers for these questions
      const answers = await AnswerModel.findAll({
        where: { quiz_id: Number(quizId) },
        order: [['question_number', 'ASC'], ['answer_number', 'ASC']]
      });
      
      // Format questions with their answers
      quizData.questions = questions.map(q => {
        const questionData = q.toJSON();
        const questionAnswers = answers
          .filter(a => a.question_number === questionData.question_number)
          .map(a => ({
            answer_number: a.answer_number,
            answer_text: a.answer_text,
            is_correct: a.is_correct
          }));
        
        return {
          question_number: questionData.question_number,
          question_text: questionData.question_text,
          question_points: questionData.question_points,
          answers: questionAnswers
        };
      });
      
      return quizData;
    }
    
    // Fallback to mock data
    return mockQuizzes.find(q => String(q.quizId) === String(quizId) && String(q.courseId) === String(courseId));
  },

  /**
   * Grade quiz by comparing submitted answers with correct answers.
   * Also saves the attempt to the quiz_attempt table.
   * @param {number} courseId - The course's ID
   * @param {number} quizId - The quiz's ID
   * @param {Object} submission - Submitted answers {userId, answers: [{question_number, answer_number}]}
   * @returns {Promise<Object|null>} Score result
   */
  async submitAnswers(courseId, quizId, submission) {
    const quiz = await this.getQuiz(courseId, quizId);
    if (!quiz) return null;
    
    const submittedAnswers = submission.answers || [];
    const userId = submission.userId;
    let score = 0;
    let totalPoints = 0;
    
    if (quiz.questions) {
      quiz.questions.forEach((question) => {
        totalPoints += question.question_points || 1;
        
        // Find submitted answer for this question
        const submitted = submittedAnswers.find(
          a => Number(a.question_number) === Number(question.question_number)
        );
        
        if (submitted && question.answers) {
          // Check if the submitted answer is correct
          const correctAnswer = question.answers.find(a => a.is_correct);
          if (correctAnswer && Number(submitted.answer_number) === Number(correctAnswer.answer_number)) {
            score += question.question_points || 1;
          }
        }
      });
      
      const result = { 
        score, 
        totalPoints,
        percentage: totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0,
        totalQuestions: quiz.questions.length 
      };
      
      // Save quiz attempt to database
      if (isDbConnected() && userId) {
        try {
          const QuizAttemptModel = getQuizAttemptModel();
          
          // Check if attempt already exists (update) or create new one
          const existingAttempt = await QuizAttemptModel.findOne({
            where: {
              quiz_id: Number(quizId),
              student_id: Number(userId)
            }
          });
          
          if (existingAttempt) {
            // Update existing attempt
            await QuizAttemptModel.update(
              { total_points: score },
              {
                where: {
                  quiz_id: Number(quizId),
                  student_id: Number(userId)
                }
              }
            );
          } else {
            // Create new attempt
            await QuizAttemptModel.create({
              quiz_id: Number(quizId),
              student_id: Number(userId),
              total_points: score
            });
          }
        } catch (err) {
          console.error('Error saving quiz attempt:', err);
          // Continue even if saving fails - return the result
        }
      }
      
      return result;
    }
    
    return { score: 0, totalPoints: 0, percentage: 0, totalQuestions: 0 };
  }
};
