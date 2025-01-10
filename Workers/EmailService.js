const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async (email ,SetUpUrl) => {

  // Configure Nodemailer transporter with your email provider's credentials
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host : 'smtp.gmail.com',
    auth: {
      user: process.env.Email , // Ensure these are set in your .env file
      pass: process.env.EmailPass ,
    },
  });


 // Step 2: Define the email options
const mailOptions = {
    from: { name: "CSIT Counselling Portal", address: process.env.Email },
    to: email, // Recipient's email
    subject: "Set up your password", // Subject line
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px;">
        <!-- Header -->
        <div style="background-color: #047857; color: white; text-align: center; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">CSIT Counselling Portal</h1>
        </div>
  
        <!-- Body -->
        <div style="padding: 20px;">
          <p style="color: #333; font-size: 16px;">Hello,</p>
          <p style="color: #555; font-size: 14px;">
            Click the button below to set up your password. This link is valid for <b>24 hours</b>.
          </p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${SetUpUrl}" style="text-decoration: none; padding: 12px 20px; background-color: #047857; color: white; border-radius: 5px; font-size: 16px; display: inline-block;">
              Set Password
            </a>
          </div>
          <p style="color: #555; font-size: 14px;">
            If you didn’t request this, please ignore this email.
          </p>
        </div>
  
        <!-- Footer -->
        <div style="background-color: #f3f4f6; padding: 10px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px;">
          <p style="margin: 0;">
            For assistance, contact us at
            <a href="mailto:support@example.com" style="color: #047857; text-decoration: none;">support@example.com</a>.
          </p>
        </div>
      </div>
    `,
  };
  


  // Step 3: Send the email
  await transporter.sendMail(mailOptions);

  console.log("Email sent successfully");


};


module.exports = {sendEmail};