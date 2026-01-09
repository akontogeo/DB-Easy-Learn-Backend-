import { DataTypes } from 'sequelize';
import { getSequelize } from '../config/database.js';

/**
 * Lesson model definition for MariaDB using Sequelize.
 * Represents lessons/materials within a course.
 */

const defineLessonModel = (sequelize) => {
  const Lesson = sequelize.define('Lesson', {
    course_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'course',
        key: 'course_id'
      }
    },
    lesson_title: {
      type: DataTypes.STRING(50),
      primaryKey: true
    },
    lesson_description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    video_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    attachment_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    summary_sheet: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    timestamps: false,
    tableName: 'lesson'
  });

  return Lesson;
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
export default function getLessonModel() {
  const sequelize = getSequelize();
  if (!sequelize) {
    return mockModel;
  }
  if (!sequelize.models.Lesson) {
    return defineLessonModel(sequelize);
  }
  return sequelize.models.Lesson;
}
