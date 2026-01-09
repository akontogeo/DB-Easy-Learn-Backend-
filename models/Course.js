import { DataTypes } from 'sequelize';
import { getSequelize } from '../config/database.js';

/**
 * Course model definition for MariaDB using Sequelize.
 */

const defineCourseModel = (sequelize) => {
  const Course = sequelize.define('Course', {
    course_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    course_title: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    course_description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'teacher',
        key: 'teacher_id'
      }
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'category',
        key: 'category_id'
      }
    }
  }, {
    timestamps: false,
    tableName: 'course'
  });

  /**
   * Find a course by its ID.
   */
  Course.findByCourseId = function(courseId) {
    return this.findByPk(courseId);
  };

  return Course;
};

// Export a function that returns the model
export default function getCourseModel() {
  const sequelize = getSequelize();
  if (!sequelize) {
    // Return mock model when not connected
    return {
      findAll: async () => [],
      findOne: async () => null,
      findByPk: async () => null,
      create: async () => null,
      update: async () => [0],
      findByCourseId: async () => null
    };
  }
  
  // Return existing model or create new one
  if (!sequelize.models.Course) {
    return defineCourseModel(sequelize);
  }
  return sequelize.models.Course;
};
