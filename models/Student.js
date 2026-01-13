import { DataTypes } from 'sequelize';
import { getSequelize } from '../config/database.js';

/**
 * Student model definition for MariaDB using Sequelize.
 * Extends User table with student-specific information.
 */

export const getStudentModel = (sequelize = getSequelize()) => {
  if (!sequelize) return null;

  // If already defined, return it
  if (sequelize.models.Student) return sequelize.models.Student;

  // Otherwise define it
  return sequelize.define(
    'Student',
    {
      student_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: 'user',
          key: 'user_id'
        }
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      profession: {
        type: DataTypes.STRING(50),
        allowNull: true
      }
    },
    {
      timestamps: false,
      tableName: 'student'
    }
  );
};

// Create a proxy to handle both connected and disconnected states
const StudentProxy = new Proxy({}, {
  get(target, prop) {
    const Student = getStudentModel();
    if (!Student) return undefined;
    return Student[prop];
  }
});

export default StudentProxy;
