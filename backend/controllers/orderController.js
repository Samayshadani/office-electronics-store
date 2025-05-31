const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = asyncHandler(async (req, res, next) => {
  const {
    shippingAddress,
    billingAddress,
    paymentMethod,
    shippingMethod,
    // paymentResult, // This would typically come from a payment gateway callback
  } = req.body;

  const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

  if (!cart || cart.items.length === 0) {
    return next(new ErrorResponse('Your cart is empty', 400));
  }

  // Basic validation for required fields
  if (!shippingAddress || !paymentMethod || !shippingMethod) {
    return next(new ErrorResponse('Please provide shipping address, payment method, and shipping method', 400));
  }

  const orderItems = cart.items.map(item => ({
    name: item.product.name,
    quantity: item.quantity,
    image: item.product.images[0] || '/placeholder.svg',
    price: item.product.price,
    product: item.product._id
  }));

  // Calculate prices
  const subtotal = cart.items.reduce((acc, item) => acc + item.quantity * item.product.price, 0);
  const taxRate = 0.08; // Example tax rate (8%)
  const taxPrice = subtotal * taxRate;

  let shippingPrice = 0;
  if (shippingMethod === 'standard') shippingPrice = 5;
  else if (shippingMethod === 'express') shippingPrice = 15;
  // 'free' shippingPrice remains 0

  const totalPrice = subtotal + taxPrice + shippingPrice;

  // Check stock for all items before creating order
  for (const item of cart.items) {
    const product = await Product.findById(item.product._id);
    if (!product || product.stock < item.quantity) {
      return next(new ErrorResponse(`Not enough stock for ${item.product.name}. Available: ${product ? product.stock : 0}`, 400));
    }
  }

  const order = new Order({
    user: req.user.id,
    orderItems,
    shippingAddress,
    billingAddress: billingAddress || shippingAddress, // Default to shipping if not provided
    paymentMethod,
    shippingMethod,
    subtotal,
    taxPrice,
    shippingPrice,
    totalPrice,
    // isPaid and paidAt would be set upon successful payment confirmation
  });

  const createdOrder = await order.save();

  // After order is successfully created, update product stock
  for (const item of createdOrder.orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity }
    });
  }

  // Clear the user's cart
  cart.items = [];
  cart.updatedAt = Date.now();
  await cart.save();

  res.status(201).json({
    success: true,
    data: createdOrder
  });
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('user', 'firstName lastName email');

  if (!order) {
    return next(new ErrorResponse(`Order not found with id of ${req.params.id}`, 404));
  }

  // Check if the user is the owner of the order or an admin
  if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to view this order', 403));
  }

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});

// --- Admin Controllers ---

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({}).populate('user', 'id firstName lastName email').sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});

// @desc    Update order status (e.g., to paid, delivered)
// @route   PUT /api/orders/:id
// @access  Private/Admin
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse(`Order not found with id of ${req.params.id}`, 404));
  }

  const { status, isPaid, isDelivered, trackingNumber, paymentResult } = req.body;

  if (status) order.status = status;
  if (trackingNumber) order.trackingNumber = trackingNumber;

  if (isPaid !== undefined) {
    order.isPaid = isPaid;
    order.paidAt = isPaid ? Date.now() : null;
    if (paymentResult) order.paymentResult = paymentResult; // Store payment gateway response
  }

  if (isDelivered !== undefined) {
    order.isDelivered = isDelivered;
    order.deliveredAt = isDelivered ? Date.now() : null;
  }

  const updatedOrder = await order.save();

  res.status(200).json({
    success: true,
    data: updatedOrder
  });
});

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
exports.deleteOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse(`Order not found with id of ${req.params.id}`, 404));
  }

  // Optional: Add logic here if you need to revert stock or other actions before deleting
  // For example, if an order is cancelled and items need to be returned to stock:
  // if (order.status === 'cancelled' || !order.isPaid) {
  //   for (const item of order.orderItems) {
  //     await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
  //   }
  // }

  await order.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});