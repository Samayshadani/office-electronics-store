const Category = require('../models/Category');
const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().populate('parent');
  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories
  });
});

// @desc    Get single category by ID or Slug
// @route   GET /api/categories/:id
// @access  Public
exports.getCategoryById = asyncHandler(async (req, res, next) => {
  // Check if param is an ObjectId or a slug
  let category;
  if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    category = await Category.findById(req.params.id).populate('parent');
  } else {
    category = await Category.findOne({ slug: req.params.id }).populate('parent');
  }

  if (!category) {
    return next(new ErrorResponse(`Category not found with id or slug of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: category
  });
});

// --- Admin Controllers ---

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = asyncHandler(async (req, res, next) => {
  const { name, description, image, featured, parent } = req.body;

  const category = await Category.create({
    name,
    description,
    image,
    featured,
    parent: parent || null
  });

  res.status(201).json({
    success: true,
    data: category
  });
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
exports.updateCategory = asyncHandler(async (req, res, next) => {
  let category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorResponse(`Category not found with id of ${req.params.id}`, 404));
  }

  const { name, description, image, featured, parent, slug } = req.body;

  category.name = name || category.name;
  category.description = description || category.description;
  category.image = image || category.image;
  category.featured = featured !== undefined ? featured : category.featured;
  category.parent = parent !== undefined ? (parent || null) : category.parent;
  if (slug) category.slug = slug; // Allow manual slug update if needed
  else if (name && name !== category.name) {
    // Auto-update slug if name changes and slug is not manually provided
    category.slug = name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
  }

  const updatedCategory = await category.save();

  res.status(200).json({
    success: true,
    data: updatedCategory
  });
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorResponse(`Category not found with id of ${req.params.id}`, 404));
  }

  // Optional: Check if category is a parent to others or has products
  const childCategories = await Category.find({ parent: category._id });
  if (childCategories.length > 0) {
    return next(new ErrorResponse(`Cannot delete category: It has child categories. Please reassign or delete them first.`, 400));
  }

  // Check if products are associated with this category name (case-insensitive)
  const productsInCategory = await Product.find({ category: { $regex: new RegExp(`^${category.name}$`, 'i') } });
  if (productsInCategory.length > 0) {
    return next(new ErrorResponse(`Cannot delete category: It has ${productsInCategory.length} products associated. Please reassign them first.`, 400));
  }

  await category.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});