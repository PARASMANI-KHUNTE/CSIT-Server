const nodemailer = require('nodemailer');
require('dotenv').config();

// Temporary in-memory storage for OTPs (use a database or cache for production)
const otpStore = new Map(); // Maps email to OTP

const sendOTP = async (email) => {
  // Generate a random 6-digit OTP
  const OTP = Math.floor(Math.random() * 900000) + 100000;

  // Configure Nodemailer transporter with your email provider's credentials
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host : 'smtp.gmail.com',
    auth: {
      user: process.env.Email , // Ensure these are set in your .env file
      pass: process.env.EmailPass ,
    },
  });

  // Email options
  const mailOptions = {
    from: {name : 'CSIT Counselling Portal' , address : process.env.Email} ,
    to: email,
    subject: 'OTP Verification',
    text: `Your OTP is: ${OTP}. It will expire in 5 minutes.`,
  };

  try {
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);

    // Store the OTP in the temporary store with expiration (5 minutes)
    otpStore.set(email, { otp: OTP, expires: Date.now() + 5 * 60 * 1000 });

    return OTP; // Return the OTP for further use if needed
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

const verifyOTP = async (email, userOTP) => {
  // Retrieve the OTP details from the store
  const otpDetails = otpStore.get(email);

  // Check if OTP exists and is not expired
  if (!otpDetails || otpDetails.expires < Date.now()) {
    otpStore.delete(email); // Remove expired OTP
    return false; // OTP expired or not found
  }

  // Compare the provided OTP with the stored OTP
  if (otpDetails.otp === parseInt(userOTP, 10)) {
    otpStore.delete(email); // Remove OTP after successful verification
    return true;
  }

  return false; // OTP does not match
};

module.exports = { sendOTP, verifyOTP };
