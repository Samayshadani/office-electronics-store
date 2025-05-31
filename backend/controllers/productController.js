const Product = require('../models/Product');
const Category = require('../models/Category');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const APIFeatures = require('../utils/apiFeatures'); // You'll need to create this utility

// @desc    Get all products with filtering, sorting, pagination
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  const features = new APIFeatures(Product.find().populate('reviewsData'), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const products = await features.query;

  // Get total count for pagination
  const totalCountQuery = new APIFeatures(Product.find(), req.query).filter();
  const totalCount = await Product.countDocuments(totalCountQuery.mongooseQuery.getQuery());

  res.status(200).json({
    success: true,
    count: products.length,
    totalCount,
    pagination: features.pagination,
    data: products
  });
});

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate('reviewsData');

  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit, 10) || 8;
  const products = await Product.find({ isFeatured: true }).limit(limit).populate('reviewsData');

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

// @desc    Get new arrival products
// @route   GET /api/products/new-arrivals
// @access  Public
exports.getNewArrivalProducts = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit, 10) || 8;
  const products = await Product.find({ isNewArrival: true }).sort({ createdAt: -1 }).limit(limit).populate('reviewsData');

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

// @desc    Get products by category slug
// @route   GET /api/products/category/:categorySlug
// @access  Public
exports.getProductsByCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findOne({ slug: req.params.categorySlug });

  if (!category) {
    return next(new ErrorResponse(`Category not found with slug ${req.params.categorySlug}`, 404));
  }

  // Find products that match the category name (case-insensitive for flexibility)
  // Or, if you store category ObjectId in Product, you'd use category._id
  const features = new APIFeatures(Product.find({ category: { $regex: new RegExp(`^${category.name}$`, 'i') } }).populate('reviewsData'), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const products = await features.query;

  const totalCountQuery = new APIFeatures(Product.find({ category: { $regex: new RegExp(`^${category.name}$`, 'i') } }), req.query).filter();
  const totalCount = await Product.countDocuments(totalCountQuery.mongooseQuery.getQuery());

  res.status(200).json({
    success: true,
    categoryName: category.name,
    count: products.length,
    totalCount,
    pagination: features.pagination,
    data: products
  });
});


// --- Admin Controllers ---

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = asyncHandler(async (req, res, next) => {
  // Add user to req.body (assuming admin is creating)
  // req.body.user = req.user.id; // If you want to track who created the product

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    data: product
  });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  }

  // Add more checks if needed, e.g., ownership or specific admin permissions

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  }

  // Add more checks if needed

  await product.remove(); // This will trigger 'remove' hooks in Product model (e.g., for deleting reviews)

  res.status(200).json({
    success: true,
    data: {}
  });
});