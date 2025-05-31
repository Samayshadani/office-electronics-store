const Review = require('../models/Review');
const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all reviews for a specific product
// @route   GET /api/products/:productId/reviews
// @route   GET /api/reviews (if you want a general review route, less common for product reviews)
// @access  Public
exports.getReviewsForProduct = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.productId) {
    const product = await Product.findById(req.params.productId);
    if (!product) {
        return next(new ErrorResponse(`Product not found with id ${req.params.productId}`, 404));
    }
    query = Review.find({ product: req.params.productId }).populate('user', 'firstName lastName');
  } else {
    // This else block would be for a general /api/reviews endpoint, which might not be what you want for product-specific reviews.
    // If you only want reviews for a product, you might remove this else block and the corresponding route.
    query = Review.find().populate('user', 'firstName lastName').populate('product', 'name');
  }

  const reviews = await query;

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews
  });
});

// @desc    Get single review by ID
// @route   GET /api/reviews/:id
// @access  Public
exports.getReviewById = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate('user', 'firstName lastName').populate('product', 'name');

  if (!review) {
    return next(new ErrorResponse(`Review not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: review
  });
});

// @desc    Create a new review for a product
// @route   POST /api/products/:productId/reviews
// @access  Private (User must be logged in)
exports.createReview = asyncHandler(async (req, res, next) => {
  req.body.product = req.params.productId;
  req.body.user = req.user.id;
  req.body.name = `${req.user.firstName} ${req.user.lastName.charAt(0)}.`; // e.g. John S.

  const product = await Product.findById(req.params.productId);
  if (!product) {
    return next(new ErrorResponse(`Product not found with id ${req.params.productId}`, 404));
  }

  // Check if user has already reviewed this product
  const existingReview = await Review.findOne({ product: req.params.productId, user: req.user.id });
  if (existingReview) {
    return next(new ErrorResponse('You have already reviewed this product', 400));
  }

  // Optional: Check if user has purchased the product before allowing review
  // This would require looking up orders for this user and product.

  const review = await Review.create(req.body);

  res.status(201).json({
    success: true,
    data: review
  });
});

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private (User must own the review or be an admin)
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse(`Review not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is review owner or admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to update this review`, 403));
  }

  const { rating, title, content, images } = req.body;
  if (rating) review.rating = rating;
  if (title) review.title = title;
  if (content) review.content = content;
  if (images) review.images = images; // Allow updating images

  review = await review.save();

  res.status(200).json({
    success: true,
    data: review
  });
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (User must own the review or be an admin)
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse(`Review not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is review owner or admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to delete this review`, 403));
  }

  await review.remove(); // This will trigger post 'remove' hook in Review model to update product average rating

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Mark a review as helpful
// @route   PATCH /api/reviews/:id/helpful
// @access  Private (User must be logged in)
exports.markReviewAsHelpful = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse(`Review not found with id of ${req.params.id}`, 404));
  }

  // In a real app, you'd prevent a user from marking the same review helpful multiple times.
  // This could be done by storing user IDs who found it helpful, or simply incrementing.
  // For simplicity, we'll just increment.
  review.helpful = (review.helpful || 0) + 1;
  await review.save();

  res.status(200).json({
    success: true,
    data: review
  });
});