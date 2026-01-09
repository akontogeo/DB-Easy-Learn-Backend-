import { DataTypes } from 'sequelize';
import { getSequelize } from '../config/database.js';

/**
 * Category model definition for MariaDB using Sequelize.
 * Represents course categories.
 */

const defineCategoryModel = (sequelize) => {
  const Category = sequelize.define('Category', {
    category_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    category_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    category_description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    creation_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'teacher',
        key: 'teacher_id'
      }
    }
  }, {
    timestamps: false,
    tableName: 'category'
  });

  return Category;
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
export default function getCategoryModel() {
  const sequelize = getSequelize();
  if (!sequelize) {
    return mockModel;
  }
  if (!sequelize.models.Category) {
    return defineCategoryModel(sequelize);
  }
  return sequelize.models.Category;
}
