import auth from 'basic-auth';
import { DEFAULT_ADMIN } from '../config/constants.js';
import getUserModel from '../models/User.js';
import { getTeacherModel } from '../models/Teacher.js';
import { getStudentModel } from '../models/Student.js';
import getCourseModel from '../models/Course.js';

/**
 * Admin Basic Auth (for admin-only routes)
 */
export function basicAuth(req, res, next) {
  const credentials = auth(req);

  if (
    !credentials ||
    credentials.name !== DEFAULT_ADMIN.username ||
    credentials.pass !== DEFAULT_ADMIN.password
  ) {
    res.setHeader('WWW-Authenticate', 'Basic realm="EasyLearn"');
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Invalid credentials'
    });
  }

  next();
}

/**
 * Teacher authentication using teacher_email from request body
 * - verifies user exists
 * - verifies user is a teacher
 * - sets req.authenticatedTeacherId
 */
export async function teacherAuth(req, res, next) {
  try {
    const user = req.user;

    if (!user || !user.user_email) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Not logged in'
      });
    }

    const UserModel = getUserModel();
    const dbUser = await UserModel.findOne({
      where: { user_email: user.user_email }
    });

    if (!dbUser) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Invalid user'
      });
    }

    const TeacherModel = getTeacherModel();
    const teacher = await TeacherModel.findOne({
      where: { teacher_id: dbUser.user_id }
    });

    if (!teacher) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'User is not a teacher'
      });
    }

    req.authenticatedTeacherId = teacher.teacher_id;
    next();
  } catch (err) {
    console.error('Teacher auth error:', err);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Authentication failed'
    });
  }
}

/**
 * Ownership check: teacher can only edit/delete their own courses
 * Requires teacherAuth to have run before it.
 */
export async function verifyCourseOwnership(req, res, next) {
  try {
    const teacherId = req.authenticatedTeacherId;
    const { courseId } = req.params;

    if (!teacherId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Teacher not authenticated'
      });
    }

    const CourseModel = getCourseModel();
    const course = await CourseModel.findByPk(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Not found',
        message: 'Course not found'
      });
    }

    if (String(course.teacher_id) !== String(teacherId)) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'Not your course'
      });
    }

    req.course = course;
    next();
  } catch (err) {
    console.error('Ownership check error:', err);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Ownership check failed'
    });
  }
}

/**
 * Student authentication
 * - verifies user exists
 * - verifies user is a student
 * - sets req.authenticatedStudentId
 */
export async function studentAuth(req, res, next) {
  try {
    const user = req.user;

    if (!user || !user.user_email) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Not logged in'
      });
    }

    const UserModel = getUserModel();
    const dbUser = await UserModel.findOne({
      where: { user_email: user.user_email }
    });

    if (!dbUser) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Invalid user'
      });
    }

    const StudentModel = getStudentModel();
    const student = await StudentModel.findOne({
      where: { student_id: dbUser.user_id }
    });

    if (!student) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'User is not a student'
      });
    }

    req.authenticatedStudentId = student.student_id;
    next();
  } catch (err) {
    console.error('Student auth error:', err);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Authentication failed'
    });
  }
}

/**
 * Ownership check: user can only access their own data
 * Requires authenticate to have run before it.
 * Checks if the userId in params matches the logged-in user
 */
export async function verifyUserOwnership(req, res, next) {
  try {
    const user = req.user;
    const { userId } = req.params;

    if (!user || !user.user_id) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'User not authenticated'
      });
    }

    // Convert both to string for comparison
    if (String(user.user_id) !== String(userId)) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'Cannot access another user\'s data'
      });
    }

    next();
  } catch (err) {
    console.error('User ownership check error:', err);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Ownership check failed'
    });
  }
}
