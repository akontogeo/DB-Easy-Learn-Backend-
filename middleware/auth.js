import auth from 'basic-auth';
import { DEFAULT_ADMIN } from '../config/constants.js';
import getUserModel from '../models/User.js';
import Teacher from '../models/Teacher.js';
import getCourseModel from '../models/Course.js';

// Middleware for HTTP Basic Authentication (admin-only routes)
export function basicAuth(req, res, next) {
  const credentials = auth(req);
  if (!credentials || credentials.name !== DEFAULT_ADMIN.username || credentials.pass !== DEFAULT_ADMIN.password) {
    res.setHeader('WWW-Authenticate', 'Basic realm="EasyLearn"');
    return res.status(401).json({ success: false, error: 'Unauthorized', message: 'Invalid credentials' });
  }
  next();
}

// Middleware for teacher authentication via email in request body
export async function teacherAuth(req, res, next) {
  try {
    const { teacher_email } = req.body;
    
    if (!teacher_email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Bad Request', 
        message: 'teacher_email is required' 
      });
    }

    // Find user by email
    const UserModel = getUserModel();
    const user = await UserModel.findOne({ where: { user_email: teacher_email } });
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized', 
        message: 'Invalid teacher email' 
      });
    }

    // Check if user is a teacher
    const TeacherModel = getTeacherModel();
    const teacher = await TeacherModel.findOne({ where: { teacher_id: user.user_id } });
    
    if (!teacher) {
      return res.status(403).json({ 
        success: false, 
        error: 'Forbidden', 
        message: 'User is not a teacher' 
      });
    }

    // Store teacher_id in request for later use
    req.authenticatedTeacherId = teacher.teacher_id;
    next();
  } catch (error) {
    console.error('Teacher auth error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal Server Error', 
      message: 'Authentication failed' 
    });
  }
}

// Middleware to verify teacher owns the course (for PUT/DELETE operations)
export async function verifyCourseOwnership(req, res, next) {
  try {
    const { courseId } = req.params;
    const teacherId = req.authenticatedTeacherId;

    if (!teacherId) {
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized', 
        message: 'Authentication required' 
      });
    }

    // Check if course exists and belongs to teacher
    const CourseModel = getCourseModel();
    const course = await CourseModel.findOne({ 
      where: { 
        course_id: courseId,
        teacher_id: teacherId 
      } 
    });

    if (!course) {
      return res.status(403).json({ 
        success: false, 
        error: 'Forbidden', 
        message: 'You do not own this course' 
      });
    }

    next();
  } catch (error) {
    console.error('Course ownership verification error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal Server Error', 
      message: 'Verification failed' 
    });
  }
}