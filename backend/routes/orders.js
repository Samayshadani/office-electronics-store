const express = require('express');
const {
  createOrder,
  getOrderById,
  getMyOrders,
  getAllOrders, // Admin
  updateOrderStatus, // Admin
  deleteOrder // Admin
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .post(protect, createOrder)
  .get(protect, authorize('admin'), getAllOrders); // Admin

router.route('/myorders')
  .get(protect, getMyOrders);

router.route('/:id')
  .get(protect, getOrderById)
  .put(protect, authorize('admin'), updateOrderStatus) // Admin
  .delete(protect, authorize('admin'), deleteOrder); // Admin

module.exports = router;