const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct, // Admin
  updateProduct, // Admin
  deleteProduct, // Admin
  getFeaturedProducts,
  getNewArrivalProducts,
  getProductsByCategory
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const reviewRouter = require('./reviews'); // For nested routes

const router = express.Router();

// Re-route into other resource routers
router.use('/:productId/reviews', reviewRouter);

router.route('/')
  .get(getProducts)
  .post(protect, authorize('admin'), createProduct);

router.route('/featured')
  .get(getFeaturedProducts);

router.route('/new-arrivals')
  .get(getNewArrivalProducts);

router.route('/category/:categorySlug')
  .get(getProductsByCategory);

router.route('/:id')
  .get(getProductById)
  .put(protect, authorize('admin'), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

module.exports = router;