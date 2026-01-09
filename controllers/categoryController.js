import { CategoryService } from '../services/categoryService.js';
import { CourseService } from '../services/courseService.js';
import { successResponse, errorResponse } from '../utils/responses.js';

/**
 * List all categories
 */
export async function listCategories(req, res, next) {
  try {
    const categories = await CategoryService.list();
    res.json(successResponse(categories, 'Categories retrieved'));
  } catch (err) {
    next(err);
  }
}

/**
 * Get a specific category by ID
 */
export async function getCategory(req, res, next) {
  try {
    const { categoryId } = req.params;
    const category = await CategoryService.getById(categoryId);
    
    if (!category) {
      return res.status(404).json(errorResponse('Not found', 'Category not found'));
    }
    
    res.json(successResponse(category, 'Category retrieved'));
  } catch (err) {
    next(err);
  }
}

/**
 * Get categories by teacher
 */
export async function getCategoriesByTeacher(req, res, next) {
  try {
    const { teacherId } = req.params;
    const categories = await CategoryService.getByTeacher(teacherId);
    res.json(successResponse(categories, 'Teacher categories retrieved'));
  } catch (err) {
    next(err);
  }
}

/**
 * Get all courses in a category
 */
export async function getCoursesByCategory(req, res, next) {
  try {
    const { categoryId } = req.params;
    const courses = await CourseService.listByCategory(categoryId);
    res.json(successResponse(courses, 'Category courses retrieved'));
  } catch (err) {
    next(err);
  }
}

/**
 * Create a new category (admin/teacher only)
 */
export async function createCategory(req, res, next) {
  try {
    const payload = req.body;
    
    const created = await CategoryService.create(payload);
    
    if (!created) {
      return res.status(500).json(errorResponse('Error', 'Failed to create category'));
    }
    
    res.status(201).json(successResponse(created, 'Category created'));
  } catch (err) {
    next(err);
  }
}

/**
 * Update a category (admin/teacher only)
 */
export async function updateCategory(req, res, next) {
  try {
    const { categoryId } = req.params;
    const payload = req.body;
    
    const updated = await CategoryService.update(categoryId, payload);
    
    if (!updated) {
      return res.status(404).json(errorResponse('Not found', 'Category not found'));
    }
    
    res.json(successResponse(updated, 'Category updated'));
  } catch (err) {
    next(err);
  }
}

/**
 * Delete a category (admin only)
 */
export async function deleteCategory(req, res, next) {
  try {
    const { categoryId } = req.params;
    
    const deleted = await CategoryService.remove(categoryId);
    
    if (!deleted) {
      return res.status(404).json(errorResponse('Not found', 'Category not found'));
    }
    
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
