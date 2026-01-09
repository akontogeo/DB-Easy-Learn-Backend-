import { RatingService } from '../services/ratingService.js';
import { CourseService } from '../services/courseService.js';
import { successResponse, errorResponse } from '../utils/responses.js';

// Get all ratings/reviews for a specific course
export async function getRatings(req, res, next) {
  try {
    const { courseId } = req.params;
    // ensure the course exists
    const course = await CourseService.getById(courseId);
    if (!course) return res.status(404).json(errorResponse('Not found', 'Course not found'));

    const list = await RatingService.listByCourse(courseId);
    if (!list || list.length === 0) return res.json(successResponse([], `No ratings found for course ${courseId}`));
    res.json(successResponse(list, `Ratings for course ${courseId} retrieved`));
  } catch (err) {
    next(err);
  }
}

/**
 * Submit a rating for a course
 */
export async function submitRating(req, res, next) {
  try {
    const { courseId } = req.params;
    const { student_id, rating, comment } = req.body;
    
    if (!student_id || !rating) {
      return res.status(400).json(errorResponse('Missing fields', 'student_id and rating are required'));
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json(errorResponse('Invalid rating', 'rating must be between 1 and 5'));
    }
    
    const payload = { student_id, rating, comment };
    const created = await RatingService.create(courseId, payload);
    res.status(201).json(successResponse(created, 'Rating created'));
  } catch (err) {
    next(err);
  }
}

/**
 * Get average rating for a course
 */
export async function getAverageRating(req, res, next) {
  try {
    const { courseId } = req.params;
    
    // Ensure the course exists
    const course = await CourseService.getById(courseId);
    if (!course) {
      return res.status(404).json(errorResponse('Not found', 'Course not found'));
    }
    
    const averageData = await RatingService.getAverageRating(courseId);
    res.json(successResponse(averageData, 'Average rating retrieved'));
  } catch (err) {
    next(err);
  }
}
