import { DataTypes } from 'sequelize';
import { getSequelize } from '../config/database.js';

/**
 * Enrollment model definition for MariaDB using Sequelize.
 * Tracks student enrollments in courses.
 */

const defineEnrollmentModel = (sequelize) => {
  const Enrollment = sequelize.define('Enrollment', {
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
    enrollment_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    timestamps: false,
    tableName: 'enrollment'
  });

  return Enrollment;
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
export default function getEnrollmentModel() {
  const sequelize = getSequelize();
  if (!sequelize) {
    return mockModel;
  }
  if (!sequelize.models.Enrollment) {
    return defineEnrollmentModel(sequelize);
  }
  return sequelize.models.Enrollment;
}
