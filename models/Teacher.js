import { DataTypes } from 'sequelize';
import { getSequelize } from '../config/database.js';

/**
 * Teacher model definition for MariaDB using Sequelize.
 * Extends User table with teacher-specific information.
 */

const defineTeacherModel = (sequelize) => {
  const Teacher = sequelize.define('Teacher', {
    teacher_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'user',
        key: 'user_id'
      }
    },
    bio: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    iban: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    timestamps: false,
    tableName: 'teacher'
  });

  return Teacher;
};

// Create a proxy to handle both connected and disconnected states
const TeacherProxy = new Proxy({}, {
  get(target, prop) {
    const sequelize = getSequelize();
    if (!sequelize) {
      return class {}[prop];
    }
    if (!sequelize.models.Teacher) {
      defineTeacherModel(sequelize);
    }
    return sequelize.models.Teacher[prop];
  }
});

export default TeacherProxy;
