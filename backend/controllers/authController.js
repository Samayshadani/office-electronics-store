const crypto = require('crypto');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const { sendEmail } = require('../utils/sendEmail');

// Utility function to send JWT token in a cookie and as JSON response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, phone, password, role } = req.body;

  // Basic validation (more comprehensive validation should be in a middleware or model)
  if (!firstName || !lastName || !email || !password) {
    return next(new ErrorResponse('Please provide first name, last name, email, and password', 400));
  }

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password,
    role // Role can be set here, or default in model. Ensure 'admin' role is protected.
  });

  // Send welcome email
  try {
    await sendEmail({
        to: user.email,
        subject: 'Welcome to Office Electronics Store!',
        html: `<p>Hi ${user.firstName},</p>
               <p>Thank you for registering at Office Electronics Store! We're excited to have you.</p>
               <p>You can now log in to your account and start shopping.</p>
               <p>Best regards,<br/>The Office Electronics Store Team</p>`
    });
  } catch (emailError) {
    console.error('Email sending error after registration:', emailError);
    // Don't fail the request if email fails, but log it
  }

  sendTokenResponse(user, 201, res);
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  // req.user is set by the auth middleware
  const user = await User.findById(req.user.id).populate('addresses'); // Populate addresses if needed

  if (!user) {
    return next(new ErrorResponse('User not found, token might be invalid', 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000), // expires in 10 seconds
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse(`No user found with email ${req.body.email}`, 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false }); // Save the token and expiry to the user model

  // Create reset URL
  // Note: The frontend URL for reset password page needs to be configured.
  const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
  // For a Next.js app, this would likely be something like: process.env.FRONTEND_URL/auth/reset-password?token=${resetToken}

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl} \n\nIf you did not request this, please ignore this email and your password will remain unchanged. This token is valid for ${process.env.RESET_PASSWORD_EXPIRE_MINUTES || 10} minutes.`;

  try {
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request - Office Electronics Store',
      text: message,
      html: `<p>You are receiving this email because you (or someone else) has requested the reset of a password for your account at Office Electronics Store.</p>
             <p>Please click on the link below to reset your password:</p>
             <p><a href="${resetUrl}" target="_blank">Reset Your Password</a></p>
             <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
             <p>This link is valid for <strong>${process.env.RESET_PASSWORD_EXPIRE_MINUTES || 10} minutes</strong>.</p>
             <p>If the link above does not work, please copy and paste the following URL into your browser:</p>
             <p>${resetUrl}</p>
             <p>Thank you,<br/>The Office Electronics Store Team</p>`
    });

    res.status(200).json({ success: true, data: 'Email sent with password reset instructions.' });
  } catch (err) {
    console.error(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resettoken
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorResponse('Invalid or expired reset token', 400));
  }

  // Set new password
  if (!req.body.password) {
    return next(new ErrorResponse('Please provide a new password', 400));
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  // Optional: Send password change confirmation email
  try {
    await sendEmail({
        to: user.email,
        subject: 'Your Password Has Been Changed - Office Electronics Store',
        html: `<p>Hi ${user.firstName},</p>
               <p>This email confirms that the password for your Office Electronics Store account has been successfully changed.</p>
               <p>If you did not make this change, please contact our support team immediately.</p>
               <p>Best regards,<br/>The Office Electronics Store Team</p>`
    });
  } catch (emailError) {
    console.error('Email sending error after password reset:', emailError);
  }

  sendTokenResponse(user, 200, res);
});