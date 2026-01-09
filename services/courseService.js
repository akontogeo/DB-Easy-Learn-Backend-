import { courses as mockCourses, nextCourseId } from '../utils/mockData.js';
import getCourseModel from '../models/Course.js';
import { isDbConnected } from '../config/database.js';

/**
 * CourseService provides CRUD operations for courses.
 * Uses MariaDB if connected, otherwise falls back to in-memory mock data.
 */
export const CourseService = {
  /**
   * List all courses, optionally filtered by category, difficulty, or premium.
   * @param {Object} filters - Optional filters: category, difficulty, premium
   * @returns {Promise<Array>} Array of course objects
   */
  async list(filters = {}) {
    // If DB is connected, fetch from database with filters
    if (isDbConnected()) {
      const CourseModel = getCourseModel();
      const where = {};
      // Note: Your schema doesn't have category, difficulty, premium fields
      // These filters may need adjustment based on actual schema
      if (filters.category) where.category = filters.category;
      if (filters.difficulty) where.difficulty = filters.difficulty;
      if (typeof filters.premium !== 'undefined') where.premium = filters.premium;
      
      const courses = await CourseModel.findAll({ where });
      return courses.map(c => c.toJSON());
    }
    // Otherwise, filter mock data
    let res = mockCourses.slice();
    if (filters.category) res = res.filter(c => c.category === filters.category);
    if (filters.difficulty) res = res.filter(c => c.difficulty === filters.difficulty);
    if (typeof filters.premium !== 'undefined') res = res.filter(c => c.premium === filters.premium);
    return Promise.resolve(res);
  },

  /**
   * Get all courses for a specific category.
   * @param {number} categoryId - The category's ID
   * @returns {Promise<Array>} Array of course objects
   */
  async listByCategory(categoryId) {
    if (isDbConnected()) {
      const CourseModel = getCourseModel();
      const courses = await CourseModel.findAll({
        where: { category_id: Number(categoryId) },
        order: [['course_title', 'ASC']]
      });
      return courses.map(c => c.toJSON());
    }
    return mockCourses.filter(c => String(c.category) === String(categoryId));
  },

  /**
   * Get a course by its courseId.
   * @param {string|number} courseId - The course's ID
   * @returns {Promise<Object|null>} The course object or null if not found
   */
  async getById(courseId) {
    if (isDbConnected()) {
      const CourseModel = getCourseModel();
      const course = await CourseModel.findOne({ 
        where: { course_id: Number(courseId) } 
      });
      return course ? course.toJSON() : null;
    }
    return mockCourses.find(c => String(c.courseId) === String(courseId));
  },

  /**
   * Create a new course.
   * @param {Object} payload - The course data to create
   * @returns {Promise<Object>} The created course object
   */
  async create(payload) {
    if (isDbConnected()) {
      const CourseModel = getCourseModel();
      // Find max course_id to increment
      const max = await CourseModel.findOne({ 
        order: [['course_id', 'DESC']] 
      });
      const id = (max && max.course_id) ? Number(max.course_id) + 1 : 1;
      const toCreate = { course_id: id, ...payload };
      const created = await CourseModel.create(toCreate);
      return created.toJSON();
    }
    // Use mock data if DB is not connected
    const newCourse = { courseId: nextCourseId(), ...payload };
    mockCourses.push(newCourse);
    return newCourse;
  },

  /**
   * Update an existing course by courseId.
   * @param {string|number} courseId - The course's ID
   * @param {Object} payload - The fields to update
   * @returns {Promise<Object|null>} The updated course object or null if not found
   */
  async update(courseId, payload) {
    if (isDbConnected()) {
      const CourseModel = getCourseModel();
      const [updated] = await CourseModel.update(payload, {
        where: { course_id: Number(courseId) }
      });
      if (updated) {
        const course = await CourseModel.findOne({ 
          where: { course_id: Number(courseId) } 
        });
        return course ? course.toJSON() : null;
      }
      return null;
    }
    // Update in mock data
    const idx = mockCourses.findIndex(c => String(c.courseId) === String(courseId));
    if (idx === -1) return null;
    mockCourses[idx] = { ...mockCourses[idx], ...payload };
    return mockCourses[idx];
  },

  /**
   * Remove a course by courseId.
   * @param {string|number} courseId - The course's ID
   * @returns {Promise<Object|null>} The removed course object or null if not found
   */
  async remove(courseId) {
    if (isDbConnected()) {
      const CourseModel = getCourseModel();
      const course = await CourseModel.findOne({ 
        where: { course_id: Number(courseId) } 
      });
      if (course) {
        const courseData = course.toJSON();
        await course.destroy();
        return courseData;
      }
      return null;
    }
    // Remove from mock data
    const idx = mockCourses.findIndex(c => String(c.courseId) === String(courseId));
    if (idx === -1) return null;
    return mockCourses.splice(idx, 1)[0];
  }
};

