import express from 'express';
import { login } from '../controllers/authController.js';
import { requireBodyFields, requireNonEmptyBodyFields } from '../middleware/validation.js';

const router = express.Router();

// POST /auth/login
router.post(
  '/login',
  requireBodyFields(['email']),
  requireNonEmptyBodyFields(['email']),
  login
);

export default router;
