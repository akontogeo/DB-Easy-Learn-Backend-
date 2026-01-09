import { DataTypes } from 'sequelize';
import { getSequelize } from '../config/database.js';

/**
 * Question model definition for MariaDB using Sequelize.
 * Represents questions within a quiz.
 */

const defineQuestionModel = (sequelize) => {
  const Question = sequelize.define('Question', {
    quiz_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'quiz',
        key: 'quiz_id'
      }
    },
    question_number: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    question_text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    question_points: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    timestamps: false,
    tableName: 'question'
  });

  return Question;
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
export default function getQuestionModel() {
  const sequelize = getSequelize();
  if (!sequelize) {
    return mockModel;
  }
  if (!sequelize.models.Question) {
    return defineQuestionModel(sequelize);
  }
  return sequelize.models.Question;
}
