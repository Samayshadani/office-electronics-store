const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Create a transporter
  // Note: For production, use a robust email service like SendGrid, Mailgun, AWS SES, etc.
  // For development, you can use services like Mailtrap.io or a local SMTP server like MailHog.
  // The example below uses generic SMTP settings which you'd configure in your .env file.

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // e.g., 'smtp.mailtrap.io' or 'smtp.gmail.com'
    port: process.env.EMAIL_PORT, // e.g., 2525 or 587 (for TLS) or 465 (for SSL)
    secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USERNAME, // Your email service username
      pass: process.env.EMAIL_PASSWORD  // Your email service password or app-specific password
    },
    // For services like Gmail, you might need to enable "Less secure app access"
    // or use OAuth2 for better security.
    // For Mailtrap, these are provided in your Mailtrap inbox settings.
  });

  // 2) Define the email options
  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME || 'Office Electronics Store'}" <${process.env.EMAIL_FROM_ADDRESS || 'noreply@example.com'}>`,
    to: options.to, // Recipient's email address
    subject: options.subject,
    text: options.text, // Plain text body (optional, if html is provided)
    html: options.html    // HTML body
  };

  // 3) Actually send the email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info)); // For Ethereal email testing
    return info;
  } catch (error) {
    console.error('Error sending email: ', error);
    // In a real app, you might want to throw this error or handle it more gracefully
    // For now, we log it and let the calling function decide how to proceed.
    throw new Error('Email could not be sent. Please try again later or contact support.');
  }
};

module.exports = { sendEmail };