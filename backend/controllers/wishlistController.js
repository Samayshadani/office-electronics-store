const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = asyncHandler(async (req, res, next) => {
  let wishlist = await Wishlist.findOne({ user: req.user.id }).populate('items.product', 'name price image brand category stock');

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user.id, items: [] });
  }

  res.status(200).json({
    success: true,
    data: wishlist
  });
});

// @desc    Add item to wishlist
// @route   POST /api/wishlist
// @access  Private
exports.addItemToWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;

  if (!productId) {
    return next(new ErrorResponse('Please provide a product ID', 400));
  }

  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorResponse(`Product not found with id ${productId}`, 404));
  }

  let wishlist = await Wishlist.findOne({ user: req.user.id });

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user.id, items: [] });
  }

  const itemExists = wishlist.items.some(item => item.product.toString() === productId);

  if (itemExists) {
    return next(new ErrorResponse('Product already in wishlist', 400));
  }

  wishlist.items.push({
    product: productId,
    name: product.name,
    price: product.price,
    image: product.images[0] || '/placeholder.svg',
    brand: product.brand,
    category: product.category
  });

  wishlist.updatedAt = Date.now();
  await wishlist.save();
  wishlist = await Wishlist.findById(wishlist._id).populate('items.product', 'name price image brand category stock');

  res.status(200).json({
    success: true,
    data: wishlist
  });
});

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
exports.removeItemFromWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  let wishlist = await Wishlist.findOne({ user: req.user.id });

  if (!wishlist) {
    return next(new ErrorResponse('Wishlist not found', 404));
  }

  const itemIndex = wishlist.items.findIndex(item => item.product.toString() === productId);

  if (itemIndex === -1) {
    return next(new ErrorResponse('Item not found in wishlist', 404));
  }

  wishlist.items.splice(itemIndex, 1);
  wishlist.updatedAt = Date.now();
  await wishlist.save();
  wishlist = await Wishlist.findById(wishlist._id).populate('items.product', 'name price image brand category stock');

  res.status(200).json({
    success: true,
    data: wishlist
  });
});

// @desc    Clear wishlist
// @route   DELETE /api/wishlist
// @access  Private
exports.clearWishlist = asyncHandler(async (req, res, next) => {
  let wishlist = await Wishlist.findOne({ user: req.user.id });

  if (!wishlist) {
    return next(new ErrorResponse('Wishlist not found', 404));
  }

  wishlist.items = [];
  wishlist.updatedAt = Date.now();
  await wishlist.save();

  res.status(200).json({
    success: true,
    msg: 'Wishlist cleared successfully',
    data: wishlist
  });
});