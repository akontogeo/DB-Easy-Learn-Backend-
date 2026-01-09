import { isDbConnected, getSequelize } from '../config/database.js';

/**
 * ScoreService provides operations for calculating user scores.
 */
export const ScoreService = {
  /**
   * Get total score for a student in a course by summing all quiz attempts.
   * @param {number} studentId - The student's ID
   * @param {number} courseId - The course's ID
   * @returns {Promise<Object>} Score data with totalScore and quizAttempts count
   */
  async getCourseScore(studentId, courseId) {
    if (isDbConnected()) {
      const sequelize = getSequelize();
      
      const [result] = await sequelize.query(
        `SELECT 
          COALESCE(SUM(qa.total_points), 0) as totalScore,
          COUNT(qa.quiz_id) as quizAttempts
         FROM quiz_attempt qa
         INNER JOIN quiz q ON qa.quiz_id = q.quiz_id
         WHERE qa.student_id = ? AND q.course_id = ?`,
        {
          replacements: [Number(studentId), Number(courseId)],
          type: sequelize.QueryTypes.SELECT
        }
      );
      
      return {
        studentId: Number(studentId),
        courseId: Number(courseId),
        totalScore: parseInt(result.totalScore) || 0,
        quizAttempts: parseInt(result.quizAttempts) || 0
      };
    }
    
    // Fallback to mock data
    return {
      studentId: Number(studentId),
      courseId: Number(courseId),
      totalScore: 0,
      quizAttempts: 0
    };
  }
};
