import { LessonService } from '../services/lessonService.js';
import { successResponse, errorResponse } from '../utils/responses.js';

/**
 * List all lessons for a course
 */
export async function listLessons(req, res, next) {
  try {
    const { courseId } = req.params;
    const lessons = await LessonService.listByCourse(courseId);
    res.json(successResponse(lessons, 'Lessons retrieved'));
  } catch (err) {
    next(err);
  }
}

/**
 * Get a specific lesson
 */
export async function getLesson(req, res, next) {
  try {
    const { courseId, lessonTitle } = req.params;
    const lesson = await LessonService.getLesson(courseId, decodeURIComponent(lessonTitle));
    
    if (!lesson) {
      return res.status(404).json(errorResponse('Not found', 'Lesson not found'));
    }
    
    res.json(successResponse(lesson, 'Lesson retrieved'));
  } catch (err) {
    next(err);
  }
}

/**
 * Create a new lesson (admin only)
 */
export async function createLesson(req, res, next) {
  try {
    const { courseId } = req.params;
    const payload = req.body;
    
    const created = await LessonService.create(courseId, payload);
    
    if (!created) {
      return res.status(500).json(errorResponse('Error', 'Failed to create lesson'));
    }
    
    res.status(201).json(successResponse(created, 'Lesson created'));
  } catch (err) {
    next(err);
  }
}

/**
 * Update a lesson (admin only)
 */
export async function updateLesson(req, res, next) {
  try {
    const { courseId, lessonTitle } = req.params;
    const payload = req.body;
    
    const updated = await LessonService.update(courseId, decodeURIComponent(lessonTitle), payload);
    
    if (!updated) {
      return res.status(404).json(errorResponse('Not found', 'Lesson not found'));
    }
    
    res.json(successResponse(updated, 'Lesson updated'));
  } catch (err) {
    next(err);
  }
}

/**
 * Delete a lesson (admin only)
 */
export async function deleteLesson(req, res, next) {
  try {
    const { courseId, lessonTitle } = req.params;
    
    const deleted = await LessonService.remove(courseId, decodeURIComponent(lessonTitle));
    
    if (!deleted) {
      return res.status(404).json(errorResponse('Not found', 'Lesson not found'));
    }
    
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
