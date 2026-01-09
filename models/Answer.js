import { DataTypes } from 'sequelize';
import { getSequelize } from '../config/database.js';

/**
 * Answer model definition for MariaDB using Sequelize.
 * Represents possible answers for quiz questions.
 */

const defineAnswerModel = (sequelize) => {
  const Answer = sequelize.define('Answer', {
    quiz_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'question',
        key: 'quiz_id'
      }
    },
    question_number: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'question',
        key: 'question_number'
      }
    },
    answer_number: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    answer_text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    is_correct: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    timestamps: false,
    tableName: 'answer'
  });

  return Answer;
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
export default function getAnswerModel() {
  const sequelize = getSequelize();
  if (!sequelize) {
    return mockModel;
  }
  if (!sequelize.models.Answer) {
    return defineAnswerModel(sequelize);
  }
  return sequelize.models.Answer;
}
