import { DataTypes } from 'sequelize';
import { getSequelize } from '../config/database.js';

/**
 * Student model definition for MariaDB using Sequelize.
 * Extends User table with student-specific information.
 */

const defineStudentModel = (sequelize) => {
  const Student = sequelize.define('Student', {
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
  }, {
    timestamps: false,
    tableName: 'student'
  });

  return Student;
};

// Create a proxy to handle both connected and disconnected states
const StudentProxy = new Proxy({}, {
  get(target, prop) {
    const sequelize = getSequelize();
    if (!sequelize) {
      return class {}[prop];
    }
    if (!sequelize.models.Student) {
      defineStudentModel(sequelize);
    }
    return sequelize.models.Student[prop];
  }
});

export default StudentProxy;
