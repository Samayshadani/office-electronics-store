const express = require('express');
const {
  getReviewsForProduct,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  markReviewAsHelpful
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');

// mergeParams: true allows us to access params from parent router (e.g., productId from product router)
const router = express.Router({ mergeParams: true });

router.route('/')
  .get(getReviewsForProduct)
  .post(protect, createReview);

router.route('/:id')
  .get(getReviewById)
  .put(protect, updateReview)
  .delete(protect, deleteReview);

router.route('/:id/helpful')
  .patch(protect, markReviewAsHelpful); // Using PATCH as it's a partial update

module.exports = router;