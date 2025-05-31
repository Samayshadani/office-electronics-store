const Contact = require('../models/Contact');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const { sendEmail } = require('../utils/sendEmail'); // Assuming you'll create this utility

// @desc    Submit a new contact message
// @route   POST /api/contact
// @access  Public
exports.submitContactForm = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, phone, subject, message } = req.body;

  if (!firstName || !lastName || !email || !subject || !message) {
    return next(new ErrorResponse('Please fill in all required fields', 400));
  }

  const contactSubmission = await Contact.create({
    firstName,
    lastName,
    email,
    phone,
    subject,
    message
  });

  // Optional: Send an email notification to admin and/or a confirmation to the user
  try {
    // Notify admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL || 'admin@example.com', // Set an admin email in .env
      subject: `New Contact Form Submission: ${subject}`,
      html: `<p>You have a new contact form submission:</p>
             <ul>
               <li>Name: ${firstName} ${lastName}</li>
               <li>Email: ${email}</li>
               <li>Phone: ${phone || 'Not provided'}</li>
               <li>Subject: ${subject}</li>
               <li>Message: ${message}</li>
             </ul>`
    });

    // Send confirmation to user
    await sendEmail({
        to: email,
        subject: 'We've Received Your Message - Office Electronics Store',
        html: `<p>Dear ${firstName},</p>
               <p>Thank you for contacting us. We have received your message regarding "${subject}" and will get back to you as soon as possible.</p>
               <p>Best regards,<br/>The Office Electronics Store Team</p>`
    });

  } catch (emailError) {
    console.error('Email sending error after contact form submission:', emailError);
    // Don't fail the request if email fails, but log it
  }

  res.status(201).json({
    success: true,
    data: contactSubmission
  });
});

// --- Admin Controllers ---

// @desc    Get all contact submissions
// @route   GET /api/contact
// @access  Private/Admin
exports.getAllContactSubmissions = asyncHandler(async (req, res, next) => {
  const submissions = await Contact.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    count: submissions.length,
    data: submissions
  });
});

// @desc    Get a single contact submission by ID
// @route   GET /api/contact/:id
// @access  Private/Admin
exports.getContactSubmissionById = asyncHandler(async (req, res, next) => {
  const submission = await Contact.findById(req.params.id);
  if (!submission) {
    return next(new ErrorResponse(`Contact submission not found with id ${req.params.id}`, 404));
  }
  res.status(200).json({
    success: true,
    data: submission
  });
});

// @desc    Update contact submission status
// @route   PUT /api/contact/:id
// @access  Private/Admin
exports.updateContactSubmissionStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  if (!status || !['new', 'in-progress', 'resolved'].includes(status)) {
    return next(new ErrorResponse('Invalid status provided', 400));
  }

  const submission = await Contact.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
  if (!submission) {
    return next(new ErrorResponse(`Contact submission not found with id ${req.params.id}`, 404));
  }
  res.status(200).json({
    success: true,
    data: submission
  });
});

// @desc    Delete a contact submission
// @route   DELETE /api/contact/:id
// @access  Private/Admin
exports.deleteContactSubmission = asyncHandler(async (req, res, next) => {
  const submission = await Contact.findById(req.params.id);
  if (!submission) {
    return next(new ErrorResponse(`Contact submission not found with id ${req.params.id}`, 404));
  }
  await submission.remove();
  res.status(200).json({
    success: true,
    data: {}
  });
});