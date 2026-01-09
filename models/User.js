import { DataTypes } from 'sequelize';
import { getSequelize } from '../config/database.js';

/**
 * User model definition for MariaDB using Sequelize.
 * Base table for all users (students and teachers).
 */

const defineUserModel = (sequelize) => {
  const User = sequelize.define('User', {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_first_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    user_last_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    user_email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    registration_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    timestamps: false,
    tableName: 'user'
  });

  /**
   * Find a user by their email address.
   */
  User.findByEmail = function(email) {
    return this.findOne({ where: { user_email: email } });
  };

  /**
   * Find a user by username.
   */
  User.findByUsername = function(username) {
    return this.findOne({ where: { username } });
  };

  return User;
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
export default function getUserModel() {
  const sequelize = getSequelize();
  if (!sequelize) {
    return mockModel;
  }
  if (!sequelize.models.User) {
    return defineUserModel(sequelize);
  }
  return sequelize.models.User;
}
