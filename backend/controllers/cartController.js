const Cart = require('../models/Cart');
const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
exports.getCart = asyncHandler(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user.id }).populate('items.product', 'name price image stock');

  if (!cart) {
    // If no cart exists, create one for the user
    cart = await Cart.create({ user: req.user.id, items: [] });
  }

  res.status(200).json({
    success: true,
    data: cart
  });
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
exports.addItemToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity || quantity < 1) {
    return next(new ErrorResponse('Please provide product ID and a valid quantity', 400));
  }

  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorResponse(`Product not found with id ${productId}`, 404));
  }

  if (product.stock < quantity) {
    return next(new ErrorResponse(`Not enough stock for ${product.name}. Available: ${product.stock}`, 400));
  }

  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    cart = await Cart.create({ user: req.user.id, items: [] });
  }

  const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

  if (itemIndex > -1) {
    // Product already in cart, update quantity
    cart.items[itemIndex].quantity += quantity;
    if (cart.items[itemIndex].quantity > product.stock) {
        return next(new ErrorResponse(`Cannot add ${quantity} more. Total quantity would exceed stock for ${product.name}. Available: ${product.stock}, In Cart: ${cart.items[itemIndex].quantity - quantity}`, 400));
    }
  } else {
    // Add new item to cart
    cart.items.push({
      product: productId,
      name: product.name,
      price: product.price,
      image: product.images[0] || '/placeholder.svg',
      quantity
    });
  }

  cart.updatedAt = Date.now();
  await cart.save();
  // Re-populate after save to get product details in response
  cart = await Cart.findById(cart._id).populate('items.product', 'name price image stock');

  res.status(200).json({
    success: true,
    data: cart
  });
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId  (itemId here is the _id of the cart item subdocument)
// @access  Private
exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const { itemId } = req.params;

  if (!quantity || quantity < 1) {
    return next(new ErrorResponse('Please provide a valid quantity (must be at least 1)', 400));
  }

  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return next(new ErrorResponse('Cart not found', 404));
  }

  const item = cart.items.id(itemId);

  if (!item) {
    return next(new ErrorResponse('Item not found in cart', 404));
  }

  const product = await Product.findById(item.product);
  if (!product) {
    return next(new ErrorResponse(`Associated product not found`, 404)); // Should not happen if data is consistent
  }

  if (product.stock < quantity) {
    return next(new ErrorResponse(`Not enough stock for ${product.name}. Available: ${product.stock}`, 400));
  }

  item.quantity = quantity;
  cart.updatedAt = Date.now();
  await cart.save();
  cart = await Cart.findById(cart._id).populate('items.product', 'name price image stock');

  res.status(200).json({
    success: true,
    data: cart
  });
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId (itemId here is the _id of the cart item subdocument)
// @access  Private
exports.removeItemFromCart = asyncHandler(async (req, res, next) => {
  const { itemId } = req.params;
  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return next(new ErrorResponse('Cart not found', 404));
  }

  const item = cart.items.id(itemId);

  if (!item) {
    return next(new ErrorResponse('Item not found in cart', 404));
  }

  item.remove(); // Mongoose subdocument remove
  cart.updatedAt = Date.now();
  await cart.save();
  cart = await Cart.findById(cart._id).populate('items.product', 'name price image stock');

  res.status(200).json({
    success: true,
    data: cart
  });
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = asyncHandler(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return next(new ErrorResponse('Cart not found', 404));
  }

  cart.items = [];
  cart.updatedAt = Date.now();
  await cart.save();

  res.status(200).json({
    success: true,
    msg: 'Cart cleared successfully',
    data: cart
  });
});