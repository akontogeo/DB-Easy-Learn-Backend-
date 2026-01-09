import { DataTypes } from 'sequelize';
import { getSequelize } from '../config/database.js';

/**
 * Progress model definition for MariaDB using Sequelize.
 * Tracks a user's progress in a course.
 * @typedef {Object} Progress
 * @property {number} id - Auto-incremented primary key
 * @property {number} progressId - Unique progress identifier
 * @property {number} userId - ID of the user
 * @property {number} courseId - ID of the course
 * @property {number} progressPercentage - Progress percentage (0-100)
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */

const defineProgressModel = (sequelize) => {
  const Progress = sequelize.define('Progress', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    progressId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      validate: {
        min: 1
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    progressPercentage: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      }
    }
  }, {
    timestamps: true,
    tableName: 'progress'
  });

  /**
   * Find a user's progress for a specific course.
   * @param {number} userId
   * @param {number} courseId
   * @returns {Promise<Progress|null>}
   */
  Progress.findByUserAndCourse = function(userId, courseId) {
    return this.findOne({ where: { userId, courseId } });
  };

  return Progress;
};

// Create a proxy to handle both connected and disconnected states
const ProgressProxy = new Proxy({}, {
  get(target, prop) {
    const sequelize = getSequelize();
    if (!sequelize) {
      return class {}[prop];
    }
    if (!sequelize.models.Progress) {
      defineProgressModel(sequelize);
    }
    return sequelize.models.Progress[prop];
  }
});

export default ProgressProxy;
