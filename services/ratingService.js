import { ratings as mockRatings, nextRatingId } from '../utils/mockData.js';
import getCourseReviewModel from '../models/Rating.js';
import { isDbConnected } from '../config/database.js';

/**
 * RatingService provides operations for course ratings.
 * Uses MariaDB if connected, otherwise falls back to in-memory mock data.
 */
export const RatingService = {
  /**
   * List all ratings for a specific course.
   * @param {string|number} courseId - The course's ID
   * @returns {Promise<Array>} Array of rating objects
   */
  async listByCourse(courseId) {
    if (isDbConnected()) {
      const CourseReviewModel = getCourseReviewModel();
      const reviews = await CourseReviewModel.findAll({ 
        where: { course_id: Number(courseId) } 
      });
      return reviews.map(r => r.toJSON());
    }
    return mockRatings.filter(r => String(r.courseId) === String(courseId));
  },

  /**
   * Create a new rating for a course.
   * @param {string|number} courseId - The course's ID
   * @param {Object} payload - The rating data to create
   * @returns {Promise<Object>} The created rating object
   */
  async create(courseId, payload) {
    if (isDbConnected()) {
      const CourseReviewModel = getCourseReviewModel();
      // CourseReview uses composite primary key (student_id, course_id)
      // so no auto-increment needed
      const toCreate = { 
        course_id: Number(courseId), 
        review_date: new Date().toISOString().split('T')[0],
        ...payload 
      };
      const created = await CourseReviewModel.create(toCreate);
      return created.toJSON();
    }
    const toCreate = { ...payload, courseId: Number(courseId) };
    const newRating = { ratingId: nextRatingId(), ...toCreate };
    mockRatings.push(newRating);
    return newRating;
  },

  /**
   * Get the average rating for a course.
   * @param {string|number} courseId - The course's ID
   * @returns {Promise<Object>} Object with averageRating and totalReviews
   */
  async getAverageRating(courseId) {
    if (isDbConnected()) {
      const { getSequelize } = await import('../config/database.js');
      const sequelize = getSequelize();
      
      const [result] = await sequelize.query(
        `SELECT 
          AVG(rating) as averageRating,
          COUNT(*) as totalReviews
         FROM course_review 
         WHERE course_id = ?`,
        {
          replacements: [Number(courseId)],
          type: sequelize.QueryTypes.SELECT
        }
      );
      
      return {
        averageRating: result.averageRating ? parseFloat(result.averageRating).toFixed(2) : null,
        totalReviews: parseInt(result.totalReviews) || 0,
        courseId: Number(courseId)
      };
    }
    
    // Fallback to mock data
    const courseRatings = mockRatings.filter(r => String(r.courseId) === String(courseId));
    if (courseRatings.length === 0) {
      return { averageRating: null, totalReviews: 0, courseId: Number(courseId) };
    }
    
    const sum = courseRatings.reduce((acc, r) => acc + (r.stars || r.rating || 0), 0);
    const avg = sum / courseRatings.length;
    
    return {
      averageRating: avg.toFixed(2),
      totalReviews: courseRatings.length,
      courseId: Number(courseId)
    };
  }
};
