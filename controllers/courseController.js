import { CourseService } from '../services/courseService.js';
import { successResponse, errorResponse } from '../utils/responses.js';

// List courses with optional filters (category, difficulty, premium)
export async function listCourses(req, res, next) {
  try {
    const filters = {};
    if (req.query.category) filters.category = req.query.category;
    if (req.query.difficulty) filters.difficulty = req.query.difficulty;
    if (req.query.premium !== undefined) filters.premium = req.query.premium === 'true';

    const data = await CourseService.list(filters);
    if (!data || data.length === 0) return res.status(204).json(successResponse([], 'No courses found'));
    res.json(successResponse(data, 'Courses retrieved'));
  } catch (err) {
    next(err);
  }
}

/**
 * Get course by id
 */
export async function getCourse(req, res, next) {
  try {
    const course = await CourseService.getById(req.params.courseId);
    if (!course) return res.status(404).json(errorResponse('Not found', 'Course not found'));
    res.json(successResponse(course, 'Course retrieved'));
  } catch (err) {
    next(err);
  }
}

/**
 * Add new course (admin)
 */
export async function addCourse(req, res, next) {
  try {
    const payload = req.body;
    const created = await CourseService.create(payload);
    res.status(201).json(successResponse(created, 'Course created'));
  } catch (err) {
    next(err);
  }
}

/**
 * Edit course (admin)
 */
export async function editCourse(req, res, next) {
  try {
    const updated = await CourseService.update(req.params.courseId, req.body);
    if (!updated) return res.status(404).json(errorResponse('Not found', 'Course not found'));
    res.json(successResponse(updated, 'Course updated'));
  } catch (err) {
    next(err);
  }
}

/**
 * Remove course (admin)
 */
export async function removeCourse(req, res, next) {
  try {
    const removed = await CourseService.remove(req.params.courseId);
    if (!removed) return res.status(404).json(errorResponse('Not found', 'Course not found'));
    // 204 No Content should not include a body
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
