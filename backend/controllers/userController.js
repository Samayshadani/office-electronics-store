const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler'); // You'll need to create this middleware
const ErrorResponse = require('../utils/errorResponse'); // You'll need to create this utility

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate('addresses');

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = asyncHandler(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    // password // Handle password update separately for security
  } = req.body;

  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  user.firstName = firstName || user.firstName;
  user.lastName = lastName || user.lastName;
  user.email = email || user.email;
  user.phone = phone || user.phone;

  // Add more fields as needed

  const updatedUser = await user.save();

  res.status(200).json({
    success: true,
    data: updatedUser
  });
});

// @desc    Add a new address for a user
// @route   POST /api/users/profile/addresses
// @access  Private
exports.addUserAddress = asyncHandler(async (req, res, next) => {
  const {
    addressType,
    street,
    apartment,
    city,
    state,
    zipCode,
    country,
    isDefault
  } = req.body;

  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  const newAddress = {
    addressType,
    street,
    apartment,
    city,
    state,
    zipCode,
    country,
    isDefault
  };

  // If isDefault is true, set all other addresses of the same type to not default
  if (isDefault) {
    user.addresses.forEach(addr => {
      if (addr.addressType === addressType) {
        addr.isDefault = false;
      }
    });
  }

  user.addresses.push(newAddress);
  await user.save();

  res.status(201).json({
    success: true,
    data: user.addresses
  });
});

// @desc    Update a user address
// @route   PUT /api/users/profile/addresses/:addressId
// @access  Private
exports.updateUserAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  const address = user.addresses.id(req.params.addressId);

  if (!address) {
    return next(new ErrorResponse('Address not found', 404));
  }

  const {
    addressType,
    street,
    apartment,
    city,
    state,
    zipCode,
    country,
    isDefault
  } = req.body;

  // If isDefault is true, set all other addresses of the same type to not default
  if (isDefault && !address.isDefault) {
    user.addresses.forEach(addr => {
      if (addr.addressType === (addressType || address.addressType) && addr._id.toString() !== req.params.addressId) {
        addr.isDefault = false;
      }
    });
  }

  address.addressType = addressType || address.addressType;
  address.street = street || address.street;
  address.apartment = apartment || address.apartment;
  address.city = city || address.city;
  address.state = state || address.state;
  address.zipCode = zipCode || address.zipCode;
  address.country = country || address.country;
  address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

  await user.save();

  res.status(200).json({
    success: true,
    data: user.addresses
  });
});

// @desc    Delete a user address
// @route   DELETE /api/users/profile/addresses/:addressId
// @access  Private
exports.deleteUserAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  const address = user.addresses.id(req.params.addressId);

  if (!address) {
    return next(new ErrorResponse('Address not found', 404));
  }

  address.remove(); // Mongoose subdocument remove method
  await user.save();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Set a user address as default
// @route   PUT /api/users/profile/addresses/:addressId/default
// @access  Private
exports.setUserDefaultAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  const addressToSetDefault = user.addresses.id(req.params.addressId);

  if (!addressToSetDefault) {
    return next(new ErrorResponse('Address not found', 404));
  }

  user.addresses.forEach(addr => {
    if (addr.addressType === addressToSetDefault.addressType) {
      addr.isDefault = addr._id.toString() === req.params.addressId;
    }
  });

  await user.save();

  res.status(200).json({
    success: true,
    data: user.addresses
  });
});

// --- Admin Controllers ---

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update user (by Admin)
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Delete user (by Admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  await user.remove(); // Triggers 'remove' middleware if any

  res.status(200).json({
    success: true,
    data: {}
  });
});