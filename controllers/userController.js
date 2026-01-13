import { UserService } from '../services/userService.js';
import { CourseService } from '../services/courseService.js';
import { EnrollmentService } from '../services/enrollmentService.js';
import { successResponse, errorResponse } from '../utils/responses.js';
import { isDbConnected } from '../config/database.js';
import jwt from 'jsonwebtoken';
// Login with email only
// Login with email only (NOW RETURNS JWT TOKEN)
export async function login(req, res, next) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json(errorResponse('Bad request', 'Email is required'));
    }

    const user = await UserService.getByEmail(email);

    if (!user) {
      return res.status(404).json(errorResponse('Not found', 'User not found with this email'));
    }

    // Determine user role (student or teacher)
    let userRole = null;
    if (isDbConnected()) {
      const { getSequelize } = await import('../config/database.js');
      const sequelize = getSequelize();

      // Check if user is a student
      const [studentResult] = await sequelize.query(
        `SELECT student_id FROM student WHERE student_id = ?`,
        {
          replacements: [Number(user.user_id)],
          type: sequelize.QueryTypes.SELECT
        }
      );

      if (studentResult) {
        userRole = 'student';
      } else {
        // Check if user is a teacher
        const [teacherResult] = await sequelize.query(
          `SELECT teacher_id FROM teacher WHERE teacher_id = ?`,
          {
            replacements: [Number(user.user_id)],
            type: sequelize.QueryTypes.SELECT
          }
        );

        if (teacherResult) {
          userRole = 'teacher';
        }
      }
    }

    // Calculate total points from all quiz attempts (only for students)
    let totalPoints = 0;
    if (userRole === 'student' && isDbConnected()) {
      const { getSequelize } = await import('../config/database.js');
      const sequelize = getSequelize();

      const [result] = await sequelize.query(
        `SELECT COALESCE(SUM(total_points), 0) as totalPoints
         FROM quiz_attempt
         WHERE student_id = ?`,
        {
          replacements: [Number(user.user_id)],
          type: sequelize.QueryTypes.SELECT
        }
      );

      totalPoints = parseInt(result.totalPoints) || 0;
    }

    // ✅ This is what your frontend expects as "user"
    const profile = {
      userId: user.user_id,
      username: user.username,
      email: user.user_email || user.email,
      role: userRole,
      points: totalPoints
    };

    // ✅ JWT payload MUST include user_email (teacherAuth expects req.user.user_email)
    const jwtPayload = {
      user_id: profile.userId,
      user_email: profile.email,
      role: profile.role
    };

    if (!process.env.JWT_SECRET) {
      return res.status(500).json(errorResponse('Server error', 'JWT_SECRET is missing in .env'));
    }

    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '7d' });

    // ✅ Now return { token, user } in data
    return res.json(
      successResponse(
        { token, user: profile },
        'Login successful'
      )
    );
  } catch (err) {
    return next(err);
  }
}


// List all users
export async function listUsers(_, res, next) {
  try {
    const data = await UserService.list();
    res.json(successResponse(data, 'Users retrieved'));
  } catch (err) {
    next(err);
  }
}

// Get a single user by id
export async function getUser(req, res, next) {
  try {
    const { userId } = req.params;
    const user = await UserService.getById(userId);

    if (!user) {
      return res.status(404).json(errorResponse('Not found', 'User not found'));
    }

    // Calculate total points from all quiz attempts across all courses
    let totalPoints = 0;
    if (isDbConnected()) {
      const { getSequelize } = await import('../config/database.js');
      const sequelize = getSequelize();
      
      const [result] = await sequelize.query(
        `SELECT COALESCE(SUM(total_points), 0) as totalPoints
         FROM quiz_attempt
         WHERE student_id = ?`,
        {
          replacements: [Number(userId)],
          type: sequelize.QueryTypes.SELECT
        }
      );
      
      totalPoints = parseInt(result.totalPoints) || 0;
    }

    const profile = {
      username: user.username,
      email: user.user_email || user.email,
      points: totalPoints
    };

    return res.json(successResponse(profile, 'User profile loaded'));
  } catch (err) {
    return next(err);
  }
}

// Create a user
export async function createUser(req, res, next) {
  try {
    const payload = req.body;
    const created = await UserService.create(payload);
    res.status(201).json(successResponse(created, 'User created'));
  } catch (err) {
    next(err);
  }
}

//Update a user
export async function updateUser(req, res, next) {
  try {
    const { userId } = req.params;
    const payload = req.body;

    const updatedUser = await UserService.update(userId, payload);

    if (!updatedUser) {
      return res.status(404).json(errorResponse('Not found', 'User not found'));
    }

    const profile = {
      username: updatedUser.username,
      points: updatedUser.points || 0,
      isPremium: Boolean(updatedUser.isPremium),
    };

    return res.json(successResponse(profile, 'User updated'));
  } catch (err) {
    return next(err);
  }
}

//Delete a user
export async function deleteUser(req, res, next) {
  try {
    const removed = await UserService.remove(req.params.userId);
    if (!removed) return res.status(404).json(errorResponse('Not found', 'User not found'));
    res.json(successResponse(removed, 'User deleted'));
  } catch (err) {
    next(err);
  }
}

//Enroll user in course
export async function enrollInCourse(req, res, next) {
  try {
    const { userId } = req.params;
    const { courseId } = req.body;

    const user = await UserService.getById(userId);
    const course = await CourseService.getById(courseId);

    if (!user || !course) {
      return res.status(404).json(errorResponse('Not found', 'User or course not found'));
    }
    
    if (course.premium && !user.isPremium) {
      return res.status(400).json(errorResponse('Not allowed', 'Course is premium. Upgrade to enroll'));
    }

    // Check if already enrolled (from database)
    const isEnrolled = await EnrollmentService.isEnrolled(userId, courseId);
    
    if (isEnrolled) {
      return res.status(200).json(successResponse({ user_id: userId, course_id: courseId }, 'Already enrolled'));
    }

    // Enroll in database
    const enrollment = await EnrollmentService.enroll(userId, courseId);
    
    if (enrollment) {
      // Initialize progress for this course
      const { ProgressService } = await import('../services/progressService.js');
      await ProgressService.upsertProgress(userId, courseId, 0);
      
      return res.json(successResponse(enrollment, 'Enrolled successfully'));
    }

    // Fallback to mock data if DB not connected
    const enrolled = (user.enrolledCourses || []).includes(Number(courseId));
    if (!enrolled) {
      const updated = await UserService.update(userId, { 
        enrolledCourses: [...(user.enrolledCourses || []), Number(courseId)] 
      });
      return res.json(successResponse(updated, 'Enrolled successfully'));
    }
    
    res.status(200).json(successResponse(user, 'Already enrolled'));
  } catch (err) {
    next(err);
  }
}

// Withdraw user from course
export async function withdrawFromCourse(req, res, next) {
  try {
    const { userId, courseId } = req.params;
    const user = await UserService.getById(userId);
    if (!user) return res.status(404).json(errorResponse('Not found', 'User not found'));
    
    // Use EnrollmentService to remove from database
    const unenrolled = await EnrollmentService.unenroll(userId, courseId);
    
    if (unenrolled) {
      // 204 No Content should not include a body
      return res.status(204).end();
    }
    
    // Fallback to mock data if DB not connected
    const enrolled = (user.enrolledCourses || []).filter(c => String(c) !== String(courseId));
    await UserService.update(userId, { enrolledCourses: enrolled });
    
    // 204 No Content should not include a body
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}


// Simple recommendations: return other courses not enrolled
export async function recommendations(req, res, next) {
  try {
    const { userId } = req.params;
    const user = await UserService.getById(userId);
    if (!user) return res.status(404).json(errorResponse('Not found', 'User not found'));
    
    const all = await CourseService.list();
    
    // Get enrolled course IDs from database
    const enrolledIds = await EnrollmentService.getStudentCourseIds(userId);
    const enrolledSet = new Set(enrolledIds.map(id => Number(id)));
    
    // Fallback to mock data if no DB enrollments
    if (enrolledSet.size === 0 && user.enrolledCourses) {
      user.enrolledCourses.forEach(id => enrolledSet.add(Number(id)));
    }
    
    const recs = all.filter(c => !enrolledSet.has(Number(c.course_id || c.courseId)));
    res.json(successResponse(recs, 'Recommendations'));
  } catch (err) {
    next(err);
  }
}

// Get courses the user is enrolled in (detailed)
export async function getUserCourses(req, res, next) {
  try {
    const { userId } = req.params;
    const user = await UserService.getById(userId);

    if (!user) {
      return res.status(404).json(errorResponse('Not found', 'User not found'));
    }

    // Try to get enrollments from database first
    const enrolledCourses = await EnrollmentService.getStudentCourses(userId);
    
    if (enrolledCourses.length > 0) {
      // Map database fields to expected format
      const formattedCourses = enrolledCourses.map((course) => ({
        id: course.course_id,
        title: course.course_title,
        shortDescription: course.course_description,
        category: course.category_id,
        difficulty: course.difficulty,
        isPremium: Boolean(course.premium),
        thumbnailUrl: course.thumbnail_url,
      }));
      return res.json(successResponse(formattedCourses, 'User courses retrieved'));
    }

    // Fallback to mock enrolledCourses array if DB returns nothing
    const allCourses = await CourseService.list();
    const enrolledIds = Array.isArray(user.enrolledCourses) ? user.enrolledCourses : [];
    const enrolledIdSet = new Set(enrolledIds.map((id) => String(id)));

    const mockEnrolledCourses = (allCourses || [])
      .filter((course) => enrolledIdSet.has(String(course.courseId)))
      .map((course) => ({
        id: course.courseId,
        title: course.title,
        shortDescription: course.shortDescription,
        category: course.category,
        difficulty: course.difficulty,
        isPremium: Boolean(course.premium),
        thumbnailUrl: course.thumbnailUrl,
      }));

    return res.json(successResponse(mockEnrolledCourses, 'User courses retrieved'));
  } catch (err) {
    return next(err);
  }
}

// Get a single enrolled course for a user
export async function getUserCourse(req, res, next) {
  try {
    const { userId, courseId } = req.params;
    const user = await UserService.getById(userId);
    if (!user) return res.status(404).json(errorResponse('Not found', 'User not found'));

    // Check enrollment from database first
    const isEnrolled = await EnrollmentService.isEnrolled(userId, courseId);
    
    if (!isEnrolled) {
      // Fallback to mock enrolledCourses array
      const enrolledIds = (user.enrolledCourses || []).map(String);
      if (!enrolledIds.includes(String(courseId))) {
        return res.status(404).json(errorResponse('Not found', 'User not enrolled in this course'));
      }
    }

    const course = await CourseService.getById(courseId);
    if (!course) return res.status(404).json(errorResponse('Not found', 'Course not found'));

    res.json(successResponse(course, 'Enrolled course retrieved'));
  } catch (err) {
    next(err);
  }
}

/**
 * Get progress for a user in a course
 */
export async function getProgress(req, res, next) {
  try {
    const { userId, courseId } = req.params;
    const { ProgressService } = await import('../services/progressService.js');
    const p = await ProgressService.getProgress(userId, courseId);
    if (!p) return res.status(404).json(errorResponse('Not found', 'Progress not found'));
    res.json(successResponse(p, 'Progress retrieved'));
  } catch (err) {
    next(err);
  }
}

/**
 * Get total score for a user in a course (sum of all quiz attempts)
 */
export async function getCourseScore(req, res, next) {
  try {
    const { userId, courseId } = req.params;
    
    // Verify user exists
    const user = await UserService.getById(userId);
    if (!user) {
      return res.status(404).json(errorResponse('Not found', 'User not found'));
    }
    
    // Verify user is enrolled in the course
    const isEnrolled = await EnrollmentService.isEnrolled(userId, courseId);
    if (!isEnrolled) {
      return res.status(404).json(errorResponse('Not enrolled', 'User not enrolled in this course'));
    }
    
    // Get the total score
    const { ScoreService } = await import('../services/scoreService.js');
    const scoreData = await ScoreService.getCourseScore(userId, courseId);
    
    res.json(successResponse(scoreData, 'Course score retrieved'));
  } catch (err) {
    next(err);
  }
}
