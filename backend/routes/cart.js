const express = require('express');
const {
  getCart,
  addItemToCart,
  updateCartItemQuantity,
  removeItemFromCart,
  clearCart
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getCart)
  .post(protect, addItemToCart)
  .delete(protect, clearCart);

router.route('/:itemId')
  .put(protect, updateCartItemQuantity)
  .delete(protect, removeItemFromCart);

module.exports = router;