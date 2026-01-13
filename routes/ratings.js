import express from 'express';
import * as ratingCtrl from '../controllers/ratingController.js';
import { authenticate } from '../middleware/authenticate.js';
import { studentAuth } from '../middleware/auth.js';

// mergeParams allows access to :courseId from parent route
const router = express.Router({ mergeParams: true });

router.get('/', ratingCtrl.getRatings);
router.get('/average', ratingCtrl.getAverageRating);
router.post('/', authenticate, studentAuth, ratingCtrl.submitRating);

export default router;
