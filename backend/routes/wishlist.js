const express = require('express');
const {
  getWishlist,
  addItemToWishlist,
  removeItemFromWishlist,
  clearWishlist
} = require('../controllers/wishlistController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getWishlist)
  .post(protect, addItemToWishlist)
  .delete(protect, clearWishlist);

router.route('/:productId')
  .delete(protect, removeItemFromWishlist);

module.exports = router;