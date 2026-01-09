import getCategoryModel from '../models/Category.js';
import { isDbConnected } from '../config/database.js';

/**
 * CategoryService provides CRUD operations for course categories.
 * Uses MariaDB if connected, otherwise falls back to empty data.
 */
export const CategoryService = {
  /**
   * List all categories.
   * @returns {Promise<Array>} Array of category objects
   */
  async list() {
    if (isDbConnected()) {
      const CategoryModel = getCategoryModel();
      const categories = await CategoryModel.findAll({
        order: [['category_name', 'ASC']]
      });
      return categories.map(c => c.toJSON());
    }
    return [];
  },

  /**
   * Get a category by its ID.
   * @param {number} categoryId - The category's ID
   * @returns {Promise<Object|null>} The category object or null if not found
   */
  async getById(categoryId) {
    if (isDbConnected()) {
      const CategoryModel = getCategoryModel();
      const category = await CategoryModel.findOne({ 
        where: { category_id: Number(categoryId) } 
      });
      return category ? category.toJSON() : null;
    }
    return null;
  },

  /**
   * Get categories by teacher.
   * @param {number} teacherId - The teacher's ID
   * @returns {Promise<Array>} Array of category objects
   */
  async getByTeacher(teacherId) {
    if (isDbConnected()) {
      const CategoryModel = getCategoryModel();
      const categories = await CategoryModel.findAll({
        where: { teacher_id: Number(teacherId) },
        order: [['category_name', 'ASC']]
      });
      return categories.map(c => c.toJSON());
    }
    return [];
  },

  /**
   * Create a new category.
   * @param {Object} payload - The category data
   * @returns {Promise<Object>} The created category object
   */
  async create(payload) {
    if (isDbConnected()) {
      const CategoryModel = getCategoryModel();
      const max = await CategoryModel.findOne({ 
        order: [['category_id', 'DESC']] 
      });
      const id = (max && max.category_id) ? Number(max.category_id) + 1 : 1;
      const toCreate = { 
        category_id: id, 
        creation_date: new Date().toISOString().split('T')[0],
        ...payload 
      };
      const created = await CategoryModel.create(toCreate);
      return created.toJSON();
    }
    return null;
  },

  /**
   * Update a category.
   * @param {number} categoryId - The category's ID
   * @param {Object} payload - The fields to update
   * @returns {Promise<Object|null>} The updated category object or null if not found
   */
  async update(categoryId, payload) {
    if (isDbConnected()) {
      const CategoryModel = getCategoryModel();
      const [updated] = await CategoryModel.update(payload, {
        where: { category_id: Number(categoryId) }
      });
      if (updated) {
        const category = await CategoryModel.findOne({ 
          where: { category_id: Number(categoryId) } 
        });
        return category ? category.toJSON() : null;
      }
      return null;
    }
    return null;
  },

  /**
   * Delete a category.
   * @param {number} categoryId - The category's ID
   * @returns {Promise<boolean>} True if deleted
   */
  async remove(categoryId) {
    if (isDbConnected()) {
      const CategoryModel = getCategoryModel();
      const deleted = await CategoryModel.destroy({
        where: { category_id: Number(categoryId) }
      });
      return deleted > 0;
    }
    return false;
  }
};
