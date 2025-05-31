const express = require('express');
const { check, validationResult } = require('express-validator');
const Newsletter = require('../models/Newsletter');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   POST api/newsletter/subscribe
// @desc    Subscribe to newsletter
// @access  Public
router.post(
  '/subscribe',
  [
    check('email', 'Please include a valid email').isEmail()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
      let subscription = await Newsletter.findOne({ email });

      if (subscription && subscription.isSubscribed) {
        return res.status(400).json({ msg: 'Email already subscribed' });
      }

      if (subscription && !subscription.isSubscribed) {
        subscription.isSubscribed = true;
        subscription.subscribedAt = Date.now();
        subscription.unsubscribedAt = undefined;
        await subscription.save();
        return res.status(200).json({
          success: true,
          msg: 'Successfully re-subscribed to the newsletter.',
          data: subscription
        });
      }

      subscription = new Newsletter({
        email
      });

      await subscription.save();
      // Optionally, send a welcome email
      res.status(201).json({
        success: true,
        msg: 'Successfully subscribed to the newsletter.',
        data: subscription
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   POST api/newsletter/unsubscribe
// @desc    Unsubscribe from newsletter
// @access  Public
router.post(
  '/unsubscribe',
  [
    check('email', 'Please include a valid email').isEmail()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
      let subscription = await Newsletter.findOne({ email });

      if (!subscription || !subscription.isSubscribed) {
        return res.status(400).json({ msg: 'Email not found or not subscribed' });
      }

      subscription.isSubscribed = false;
      subscription.unsubscribedAt = Date.now();
      await subscription.save();

      res.json({
        success: true,
        msg: 'Successfully unsubscribed from the newsletter.'
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/newsletter/subscriptions
// @desc    Get all newsletter subscriptions (Admin)
// @access  Private/Admin
router.get('/subscriptions', protect, authorize('admin'), async (req, res) => {
  try {
    const subscriptions = await Newsletter.find().sort({ subscribedAt: -1 });
    res.json({
      success: true,
      count: subscriptions.length,
      data: subscriptions
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;