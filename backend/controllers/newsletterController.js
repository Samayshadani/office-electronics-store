const Newsletter = require('../models/Newsletter');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const { sendEmail } = require('../utils/sendEmail'); // Assuming this utility will be created

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
exports.subscribeToNewsletter = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ErrorResponse('Please provide an email address', 400));
  }

  let subscription = await Newsletter.findOne({ email });

  if (subscription && subscription.isSubscribed) {
    return next(new ErrorResponse('This email is already subscribed', 400));
  }

  if (subscription && !subscription.isSubscribed) {
    // Resubscribing
    subscription.isSubscribed = true;
    subscription.subscribedAt = Date.now();
    subscription.unsubscribedAt = null;
    await subscription.save();
  } else {
    // New subscription
    subscription = await Newsletter.create({ email });
  }

  // Send a welcome/confirmation email
  try {
    await sendEmail({
        to: email,
        subject: 'Welcome to Our Newsletter! - Office Electronics Store',
        html: `<p>Hi there,</p>
               <p>Thank you for subscribing to the Office Electronics Store newsletter! You'll now be among the first to hear about our new arrivals, special offers, and exclusive deals.</p>
               <p>Stay tuned for exciting updates!</p>
               <p>Best regards,<br/>The Office Electronics Store Team</p>
               <p><small>If you wish to unsubscribe, you can do so at any time by visiting our website or clicking the unsubscribe link in future emails.</small></p>`
    });
  } catch (emailError) {
    console.error('Email sending error after newsletter subscription:', emailError);
    // Don't fail the request if email fails, but log it
  }

  res.status(200).json({
    success: true,
    message: 'Successfully subscribed to the newsletter',
    data: subscription
  });
});

// @desc    Unsubscribe from newsletter
// @route   POST /api/newsletter/unsubscribe
// @access  Public
exports.unsubscribeFromNewsletter = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ErrorResponse('Please provide an email address', 400));
  }

  const subscription = await Newsletter.findOne({ email });

  if (!subscription || !subscription.isSubscribed) {
    return next(new ErrorResponse('This email is not currently subscribed or does not exist', 404));
  }

  subscription.isSubscribed = false;
  subscription.unsubscribedAt = Date.now();
  await subscription.save();

  // Optional: Send a confirmation of unsubscription email
  try {
    await sendEmail({
        to: email,
        subject: 'You Have Unsubscribed - Office Electronics Store',
        html: `<p>Hi there,</p>
               <p>You have successfully unsubscribed from the Office Electronics Store newsletter. You will no longer receive promotional emails from us.</p>
               <p>If this was a mistake, you can resubscribe at any time on our website.</p>
               <p>Best regards,<br/>The Office Electronics Store Team</p>`
    });
  } catch (emailError) {
    console.error('Email sending error after newsletter unsubscription:', emailError);
  }

  res.status(200).json({
    success: true,
    message: 'Successfully unsubscribed from the newsletter'
  });
});

// --- Admin Controllers ---

// @desc    Get all newsletter subscriptions
// @route   GET /api/newsletter/subscriptions
// @access  Private/Admin
exports.getAllSubscriptions = asyncHandler(async (req, res, next) => {
  const subscriptions = await Newsletter.find().sort({ subscribedAt: -1 });

  res.status(200).json({
    success: true,
    count: subscriptions.length,
    data: subscriptions
  });
});