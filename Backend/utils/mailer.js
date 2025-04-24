// utils/mailer.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: `"Radiant Skincare" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your Radiant Skincare OTP Code',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 10px;">
        <h2>Hello from Radiant Skincare 👋</h2>
        <p>Here is your OTP to complete registration:</p>
        <h3 style="color: #6C63FF;">${otp}</h3>
        <p>This OTP will expire in 5 minutes.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendOTP;
