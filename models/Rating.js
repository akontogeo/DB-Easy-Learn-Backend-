import { DataTypes } from 'sequelize';
import { getSequelize } from '../config/database.js';

/**
 * CourseReview model definition for MariaDB using Sequelize.
 * Represents student reviews and ratings for courses.
 */

const defineCourseReviewModel = (sequelize) => {
  const CourseReview = sequelize.define('CourseReview', {
    student_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'student',
        key: 'student_id'
      }
    },
    course_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'course',
        key: 'course_id'
      }
    },
    review_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    timestamps: false,
    tableName: 'course_review'
  });

  /**
   * Find all reviews for a course.
   */
  CourseReview.findByCourseId = function(courseId) {
    return this.findAll({ where: { course_id: courseId } });
  };

  return CourseReview;
};

// Mock model for when DB is not connected
const mockModel = {
  find: () => Promise.resolve([]),
  findOne: () => Promise.resolve(null),
  findAll: () => Promise.resolve([]),
  findByPk: () => Promise.resolve(null),
  create: () => Promise.resolve({}),
  update: () => Promise.resolve([0]),
  destroy: () => Promise.resolve(0)
};

// Lazy initialization function
export default function getCourseReviewModel() {
  const sequelize = getSequelize();
  if (!sequelize) {
    return mockModel;
  }
  if (!sequelize.models.CourseReview) {
    return defineCourseReviewModel(sequelize);
  }
  return sequelize.models.CourseReview;
}
