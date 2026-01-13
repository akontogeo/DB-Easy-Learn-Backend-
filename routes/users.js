import express from 'express';
import * as userCtrl from '../controllers/userController.js';
import { authenticate } from '../middleware/authenticate.js';
import { verifyUserOwnership, studentAuth } from '../middleware/auth.js';
import { requireBodyFields } from '../middleware/validation.js';

const router = express.Router();

/**
 * User CRUD routes
 * @route GET /users
 * @route POST /users
 * @route GET /users/:userId
 * @route PUT /users/:userId
 * @route DELETE /users/:userId
 */

// Validate userId param middleware
function validateUserId(req, res, next) {
	const { userId } = req.params;
	if (!/^[0-9]+$/.test(userId)) {
		return res.status(400).json({ error: 'Invalid userId parameter' });
	}
	next();
}

router.get('/', userCtrl.listUsers);
router.post('/', requireBodyFields(['username','email','password']), userCtrl.createUser);
router.post('/login', requireBodyFields(['email']), userCtrl.login);
router.get('/:userId', authenticate, verifyUserOwnership, validateUserId, userCtrl.getUser);
router.put('/:userId', authenticate, verifyUserOwnership, validateUserId, userCtrl.updateUser);
router.delete('/:userId', authenticate, verifyUserOwnership, validateUserId, userCtrl.deleteUser);

/**
 * Course enrollment routes for users
 * @route GET /users/:userId/courses/:courseId
 * @route GET /users/:userId/courses
 * @route POST /users/:userId/courses
 * @route DELETE /users/:userId/courses/:courseId
 */

// Validate courseId param middleware
function validateCourseId(req, res, next) {
	const { courseId } = req.params;
	if (courseId && !/^[0-9]+$/.test(courseId)) {
		return res.status(400).json({ error: 'Invalid courseId parameter' });
	}
	next();
}

router.get('/:userId/courses/:courseId', authenticate, verifyUserOwnership, validateUserId, validateCourseId, userCtrl.getUserCourse);
router.get('/:userId/courses', authenticate, verifyUserOwnership, validateUserId, userCtrl.getUserCourses);
router.post('/:userId/courses', authenticate, verifyUserOwnership, studentAuth, validateUserId, requireBodyFields(['courseId']), userCtrl.enrollInCourse);
router.delete('/:userId/courses/:courseId', authenticate, verifyUserOwnership, studentAuth, validateUserId, validateCourseId, userCtrl.withdrawFromCourse);

/**
 * Get course recommendations for a user
 * @route GET /users/:userId/recommendations
 */

router.get('/:userId/recommendations', authenticate, verifyUserOwnership, validateUserId, userCtrl.recommendations);

/**
 * User progress tracking for a course
 * @route GET /users/:userId/courses/:courseId/progress
 */

router.get('/:userId/courses/:courseId/progress', authenticate, verifyUserOwnership, validateUserId, validateCourseId, userCtrl.getProgress);

/**
 * User total score in a course (sum of all quiz attempts)
 * @route GET /users/:userId/courses/:courseId/score
 */

router.get('/:userId/courses/:courseId/score', authenticate, verifyUserOwnership, validateUserId, validateCourseId, userCtrl.getCourseScore);

export default router;
