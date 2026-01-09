import { DataTypes } from 'sequelize';
import { getSequelize } from '../config/database.js';

/**
 * Quiz model definition for MariaDB using Sequelize.
 */

const defineQuizModel = (sequelize) => {
  const Quiz = sequelize.define('Quiz', {
    quiz_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    quiz_title: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'course',
        key: 'course_id'
      }
    }
  }, {
    timestamps: false,
    tableName: 'quiz'
  });

  /**
   * Find a quiz by its ID.
   */
  Quiz.findByQuizId = function(quizId) {
    return this.findByPk(quizId);
  };

  return Quiz;
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
export default function getQuizModel() {
  const sequelize = getSequelize();
  if (!sequelize) {
    return mockModel;
  }
  if (!sequelize.models.Quiz) {
    return defineQuizModel(sequelize);
  }
  return sequelize.models.Quiz;
}
