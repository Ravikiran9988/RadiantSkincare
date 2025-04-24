// utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // or use SMTP details
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"Radiant Skincare" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text
    });

    console.log('✅ Email sent to:', to);
  } catch (err) {
    console.error('❌ Email sending failed:', err);
    throw err;
  }
};

module.exports = sendEmail;
