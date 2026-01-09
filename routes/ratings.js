import express from 'express';
import * as ratingCtrl from '../controllers/ratingController.js';

// mergeParams allows access to :courseId from parent route
const router = express.Router({ mergeParams: true });

router.get('/', ratingCtrl.getRatings);
router.get('/average', ratingCtrl.getAverageRating);
router.post('/', ratingCtrl.submitRating);

export default router;
