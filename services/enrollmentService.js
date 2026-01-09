import getEnrollmentModel from '../models/Enrollment.js';
import getCourseModel from '../models/Course.js';
import { isDbConnected } from '../config/database.js';

/**
 * EnrollmentService provides operations for student course enrollments.
 * Uses MariaDB enrollment table if connected.
 */
export const EnrollmentService = {
  /**
   * Get all course IDs that a student is enrolled in.
   * @param {number} studentId - The student's ID
   * @returns {Promise<Array<number>>} Array of course IDs
   */
  async getStudentCourseIds(studentId) {
    if (isDbConnected()) {
      const EnrollmentModel = getEnrollmentModel();
      const enrollments = await EnrollmentModel.findAll({
        where: { student_id: Number(studentId) },
        attributes: ['course_id']
      });
      return enrollments.map(e => e.course_id);
    }
    return [];
  },

  /**
   * Get all enrolled courses with full details for a student.
   * @param {number} studentId - The student's ID
   * @returns {Promise<Array>} Array of course objects
   */
  async getStudentCourses(studentId) {
    if (isDbConnected()) {
      const EnrollmentModel = getEnrollmentModel();
      const CourseModel = getCourseModel();
      const sequelize = CourseModel.sequelize;
      
      // Join enrollment with course table
      const enrollments = await sequelize.query(
        `SELECT c.* FROM enrollment e 
         INNER JOIN course c ON e.course_id = c.course_id 
         WHERE e.student_id = ?`,
        {
          replacements: [Number(studentId)],
          type: sequelize.QueryTypes.SELECT
        }
      );
      return enrollments;
    }
    return [];
  },

  /**
   * Check if a student is enrolled in a course.
   * @param {number} studentId - The student's ID
   * @param {number} courseId - The course's ID
   * @returns {Promise<boolean>} True if enrolled
   */
  async isEnrolled(studentId, courseId) {
    if (isDbConnected()) {
      const EnrollmentModel = getEnrollmentModel();
      const enrollment = await EnrollmentModel.findOne({
        where: { 
          student_id: Number(studentId),
          course_id: Number(courseId)
        }
      });
      return !!enrollment;
    }
    return false;
  },

  /**
   * Enroll a student in a course.
   * @param {number} studentId - The student's ID
   * @param {number} courseId - The course's ID
   * @returns {Promise<Object>} The created enrollment
   */
  async enroll(studentId, courseId) {
    if (isDbConnected()) {
      const EnrollmentModel = getEnrollmentModel();
      const enrollment = await EnrollmentModel.create({
        student_id: Number(studentId),
        course_id: Number(courseId),
        enrollment_date: new Date().toISOString().split('T')[0]
      });
      return enrollment.toJSON();
    }
    return null;
  },

  /**
   * Unenroll a student from a course.
   * @param {number} studentId - The student's ID
   * @param {number} courseId - The course's ID
   * @returns {Promise<boolean>} True if unenrolled
   */
  async unenroll(studentId, courseId) {
    if (isDbConnected()) {
      const EnrollmentModel = getEnrollmentModel();
      const deleted = await EnrollmentModel.destroy({
        where: { 
          student_id: Number(studentId),
          course_id: Number(courseId)
        }
      });
      return deleted > 0;
    }
    return false;
  }
};
