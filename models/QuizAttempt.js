import { DataTypes } from 'sequelize';
import { getSequelize } from '../config/database.js';

/**
 * QuizAttempt model definition for MariaDB using Sequelize.
 * Tracks student quiz attempts and scores.
 */

const defineQuizAttemptModel = (sequelize) => {
  const QuizAttempt = sequelize.define('QuizAttempt', {
    quiz_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'quiz',
        key: 'quiz_id'
      }
    },
    student_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'student',
        key: 'student_id'
      }
    },
    total_points: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    timestamps: false,
    tableName: 'quiz_attempt'
  });

  return QuizAttempt;
};

// Lazy initialization function
export default function getQuizAttemptModel() {
  const sequelize = getSequelize();
  
  // Return mock model if DB not connected
  if (!sequelize) {
    return {
      findAll: async () => [],
      findOne: async () => null,
      create: async (data) => data,
      update: async () => [0],
      destroy: async () => 0
    };
  }
  
  // Return existing model or define it
  if (!sequelize.models.QuizAttempt) {
    return defineQuizAttemptModel(sequelize);
  }
  
  return sequelize.models.QuizAttempt;
}
