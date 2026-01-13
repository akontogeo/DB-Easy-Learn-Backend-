import { users as mockUsers, nextUserId } from '../utils/mockData.js';
import { getUserModel } from '../models/User.js';
  
import { isDbConnected } from '../config/database.js';

/**
 * UserService provides CRUD operations for users.
 * Uses MariaDB if connected, otherwise falls back to in-memory mock data.
 */
export const UserService = {
  /**
   * List all users.
   * @returns {Promise<Array>} Array of user objects
   */
  async list() {
    if (isDbConnected()) {
      const UserModel = getUserModel();
      const users = await UserModel.findAll();
      return users.map(u => u.toJSON());
    }
    return Promise.resolve(mockUsers);
  },

  /**
   * Get a user by their userId.
   * @param {string|number} userId - The user's ID
   * @returns {Promise<Object|null>} The user object or null if not found
   */
  async getById(userId) {
    if (isDbConnected()) {
      const UserModel = getUserModel();
      const user = await UserModel.findOne({ 
        where: { user_id: Number(userId) } 
      });
      return user ? user.toJSON() : null;
    }
    return mockUsers.find(u => String(u.userId) === String(userId));
  },

  /**
   * Create a new user.
   * @param {Object} payload - The user data to create
   * @returns {Promise<Object>} The created user object
   */
  async create(payload) {
    if (isDbConnected()) {
      const UserModel = getUserModel();
      const max = await UserModel.findOne({ 
        order: [['user_id', 'DESC']] 
      });
      const id = (max && max.user_id) ? Number(max.user_id) + 1 : 1;
      const toCreate = { user_id: id, ...payload };
      const created = await UserModel.create(toCreate);
      return created.toJSON();
    }
    const newUser = { userId: nextUserId(), ...payload };
    mockUsers.push(newUser);
    return newUser;
  },

  /**
   * Update an existing user by userId.
   * @param {string|number} userId - The user's ID
   * @param {Object} payload - The fields to update
   * @returns {Promise<Object|null>} The updated user object or null if not found
   */
  async update(userId, payload) {
    if (isDbConnected()) {
      const UserModel = getUserModel();
      const [updated] = await UserModel.update(payload, {
        where: { user_id: Number(userId) }
      });
      if (updated) {
        const user = await UserModel.findOne({ 
          where: { user_id: Number(userId) } 
        });
        return user ? user.toJSON() : null;
      }
      return null;
    }
    const idx = mockUsers.findIndex(u => String(u.userId) === String(userId));
    if (idx === -1) return null;
    mockUsers[idx] = { ...mockUsers[idx], ...payload };
    return mockUsers[idx];
  },

  /**
   * Remove a user by userId.
   * @param {string|number} userId - The user's ID
   * @returns {Promise<Object|null>} The removed user object or null if not found
   */
  async remove(userId) {
    if (isDbConnected()) {
      const UserModel = getUserModel();
      const user = await UserModel.findOne({ 
        where: { user_id: Number(userId) } 
      });
      if (user) {
        const userData = user.toJSON();
        await user.destroy();
        return userData;
      }
      return null;
    }
    const idx = mockUsers.findIndex(u => String(u.userId) === String(userId));
    if (idx === -1) return null;
    return mockUsers.splice(idx, 1)[0];
  },

  /**
   * Get a user by their email.
   * @param {string} email - The user's email address
   * @returns {Promise<Object|null>} The user object or null if not found
   */
  async getByEmail(email) {
    if (isDbConnected()) {
      const UserModel = getUserModel();
      const user = await UserModel.findOne({ 
        where: { user_email: email } 
      });
      return user ? user.toJSON() : null;
    }
    return mockUsers.find(u => u.email === email || u.user_email === email);
  }
};
