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
    const decodedTitle = decodeURIComponent(lessonTitle);

    const lesson = await LessonService.getLesson(courseId, decodedTitle);

    if (!lesson) {
      return res.status(404).json(errorResponse('Not found', 'Lesson not found'));
    }

    res.json(successResponse(lesson, 'Lesson retrieved'));
  } catch (err) {
    next(err);
  }
}

/**
 * Create a new lesson (teacher + ownership)
 * NOTE: teacherAuth + verifyCourseOwnership already ran
 */
export async function createLesson(req, res, next) {
  try {
    const { courseId } = req.params;

    const payload = { ...req.body };

    // Δεν θες να αποθηκεύσεις email στο lesson record
    delete payload.teacher_email;

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
 * Update a lesson (teacher + ownership)
 */
export async function updateLesson(req, res, next) {
  try {
    const { courseId, lessonTitle } = req.params;
    const decodedTitle = decodeURIComponent(lessonTitle);

    const payload = { ...req.body };
    delete payload.teacher_email;

    const updated = await LessonService.update(courseId, decodedTitle, payload);

    if (!updated) {
      return res.status(404).json(errorResponse('Not found', 'Lesson not found'));
    }

    res.json(successResponse(updated, 'Lesson updated'));
  } catch (err) {
    next(err);
  }
}

/**
 * Delete a lesson (teacher + ownership)
 */
export async function deleteLesson(req, res, next) {
  try {
    const { courseId, lessonTitle } = req.params;
    const decodedTitle = decodeURIComponent(lessonTitle);

    const deleted = await LessonService.remove(courseId, decodedTitle);

    if (!deleted) {
      return res.status(404).json(errorResponse('Not found', 'Lesson not found'));
    }

    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
