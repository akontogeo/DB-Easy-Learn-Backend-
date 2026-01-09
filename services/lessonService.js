import getLessonModel from '../models/Lesson.js';
import { isDbConnected } from '../config/database.js';

/**
 * LessonService provides CRUD operations for course lessons.
 * Uses MariaDB if connected, otherwise falls back to empty data.
 */
export const LessonService = {
  /**
   * List all lessons for a specific course.
   * @param {number} courseId - The course's ID
   * @returns {Promise<Array>} Array of lesson objects
   */
  async listByCourse(courseId) {
    if (isDbConnected()) {
      const LessonModel = getLessonModel();
      const lessons = await LessonModel.findAll({
        where: { course_id: Number(courseId) },
        order: [['lesson_title', 'ASC']]
      });
      return lessons.map(l => l.toJSON());
    }
    return [];
  },

  /**
   * Get a specific lesson from a course.
   * @param {number} courseId - The course's ID
   * @param {string} lessonTitle - The lesson's title
   * @returns {Promise<Object|null>} The lesson object or null if not found
   */
  async getLesson(courseId, lessonTitle) {
    if (isDbConnected()) {
      const LessonModel = getLessonModel();
      const lesson = await LessonModel.findOne({
        where: { 
          course_id: Number(courseId),
          lesson_title: lessonTitle
        }
      });
      return lesson ? lesson.toJSON() : null;
    }
    return null;
  },

  /**
   * Create a new lesson for a course.
   * @param {number} courseId - The course's ID
   * @param {Object} payload - The lesson data (lesson_title, lesson_description, video_url, etc.)
   * @returns {Promise<Object>} The created lesson object
   */
  async create(courseId, payload) {
    if (isDbConnected()) {
      const LessonModel = getLessonModel();
      const toCreate = {
        course_id: Number(courseId),
        ...payload
      };
      const created = await LessonModel.create(toCreate);
      return created.toJSON();
    }
    return null;
  },

  /**
   * Update a lesson.
   * @param {number} courseId - The course's ID
   * @param {string} lessonTitle - The lesson's title
   * @param {Object} payload - The fields to update
   * @returns {Promise<Object|null>} The updated lesson object or null if not found
   */
  async update(courseId, lessonTitle, payload) {
    if (isDbConnected()) {
      const LessonModel = getLessonModel();
      const [updated] = await LessonModel.update(payload, {
        where: { 
          course_id: Number(courseId),
          lesson_title: lessonTitle
        }
      });
      if (updated) {
        const lesson = await LessonModel.findOne({
          where: { 
            course_id: Number(courseId),
            lesson_title: lessonTitle
          }
        });
        return lesson ? lesson.toJSON() : null;
      }
      return null;
    }
    return null;
  },

  /**
   * Delete a lesson.
   * @param {number} courseId - The course's ID
   * @param {string} lessonTitle - The lesson's title
   * @returns {Promise<boolean>} True if deleted
   */
  async remove(courseId, lessonTitle) {
    if (isDbConnected()) {
      const LessonModel = getLessonModel();
      const deleted = await LessonModel.destroy({
        where: { 
          course_id: Number(courseId),
          lesson_title: lessonTitle
        }
      });
      return deleted > 0;
    }
    return false;
  },

  /**
   * Count total lessons in a course.
   * @param {number} courseId - The course's ID
   * @returns {Promise<number>} Number of lessons
   */
  async countByCourse(courseId) {
    if (isDbConnected()) {
      const LessonModel = getLessonModel();
      const count = await LessonModel.count({
        where: { course_id: Number(courseId) }
      });
      return count;
    }
    return 0;
  }
};
