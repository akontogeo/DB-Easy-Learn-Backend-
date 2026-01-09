import express from 'express';
import * as categoryCtrl from '../controllers/categoryController.js';
import { basicAuth } from '../middleware/auth.js';
import { requireBodyFields } from '../middleware/validation.js';

const router = express.Router();

/**
 * Category routes
 * GET    /categories                    - List all categories
 * GET    /categories/:categoryId        - Get specific category
 * GET    /categories/:categoryId/courses - Get all courses in category
 * GET    /categories/teacher/:teacherId - Get categories by teacher
 * POST   /categories                    - Create category (admin/teacher)
 * PUT    /categories/:categoryId        - Update category (admin/teacher)
 * DELETE /categories/:categoryId        - Delete category (admin)
 */

router.get('/', categoryCtrl.listCategories);
router.get('/teacher/:teacherId', categoryCtrl.getCategoriesByTeacher);
router.get('/:categoryId', categoryCtrl.getCategory);
router.get('/:categoryId/courses', categoryCtrl.getCoursesByCategory);
router.post('/', basicAuth, requireBodyFields(['category_name', 'teacher_id']), categoryCtrl.createCategory);
router.put('/:categoryId', basicAuth, categoryCtrl.updateCategory);
router.delete('/:categoryId', basicAuth, categoryCtrl.deleteCategory);

export default router;
