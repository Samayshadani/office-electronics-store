const express = require('express');
const { check, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   POST api/contact
// @desc    Submit a contact form
// @access  Public
router.post(
  '/',
  [
    check('firstName', 'First name is required').not().isEmpty(),
    check('lastName', 'Last name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('subject', 'Subject is required').not().isEmpty(),
    check('message', 'Message is required').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, phone, subject, message } = req.body;

    try {
      const newContact = new Contact({
        firstName,
        lastName,
        email,
        phone,
        subject,
        message
      });

      const contact = await newContact.save();
      // Optionally, send an email notification to admin and/or confirmation to user
      res.status(201).json({
        success: true,
        data: contact,
        msg: 'Your message has been submitted successfully. We will get back to you soon.'
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/contact
// @desc    Get all contact submissions (Admin)
// @access  Private/Admin
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/contact/:id
// @desc    Get a single contact submission (Admin)
// @access  Private/Admin
router.get('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ msg: 'Contact submission not found' });
    }
    res.json({
      success: true,
      data: contact
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Contact submission not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/contact/:id
// @desc    Update contact submission status (Admin)
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  const { status } = req.body;
  try {
    let contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ msg: 'Contact submission not found' });
    }

    contact.status = status || contact.status;
    await contact.save();

    res.json({
      success: true,
      data: contact
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/contact/:id
// @desc    Delete a contact submission (Admin)
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ msg: 'Contact submission not found' });
    }

    await contact.remove(); // Deprecated, use deleteOne or deleteMany
    // await Contact.deleteOne({ _id: req.params.id });

    res.json({
      success: true,
      msg: 'Contact submission removed'
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Contact submission not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;