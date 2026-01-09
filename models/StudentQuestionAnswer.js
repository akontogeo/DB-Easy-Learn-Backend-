import { DataTypes } from 'sequelize';
import { getSequelize } from '../config/database.js';

/**
 * StudentQuestionAnswer model definition for MariaDB using Sequelize.
 * Tracks student answers to specific quiz questions.
 */

const defineStudentQuestionAnswerModel = (sequelize) => {
  const StudentQuestionAnswer = sequelize.define('StudentQuestionAnswer', {
    quiz_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'question',
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
    question_number: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'question',
        key: 'question_number'
      }
    },
    selected_answer: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    timestamps: false,
    tableName: 'student_question_answer'
  });

  return StudentQuestionAnswer;
};

// Create a proxy to handle both connected and disconnected states
const StudentQuestionAnswerProxy = new Proxy({}, {
  get(target, prop) {
    const sequelize = getSequelize();
    if (!sequelize) {
      return class {}[prop];
    }
    if (!sequelize.models.StudentQuestionAnswer) {
      defineStudentQuestionAnswerModel(sequelize);
    }
    return sequelize.models.StudentQuestionAnswer[prop];
  }
});

export default StudentQuestionAnswerProxy;
