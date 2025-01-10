const express = require('express');
const router = express.Router();
const user = require('../Database/models/User')
const OtpService = require('../Workers/OtpService');
const tokenService = require('../Workers/TokenService');
const verifyToken = require('../Workers/VerifyToken')
const Encrypt = require('../Workers/Encrypt');
const { verify } = require('jsonwebtoken');
const UrlService = require('../Workers/UrlService');
const EmailService = require('../Workers/EmailService')
const jwt = require('jsonwebtoken')

router.get('/setup-password', async (req, res) => {
  const { token } = req.query;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Check if the user exists in your database
    const User = await user.findById(userId);
    if (!User) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Allow the user to set their password
    res.status(200).json({ message: 'Token is valid', userId });
  } catch (error) {
    console.error('Invalid token:', error);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});

router.post('/sendSetupLink', async (req, res) => {
  const { email  } = req.body;
  console.log(`Email Recived ${email}`)
  const User = await user.findOne({email})
  console.log(`User Found ${User}`)
  const UserId = User.id;
  console.log(`User Id  Found ${UserId}`)
  const SetUpUrl = await UrlService.generateSetupPasswordLink(UserId)
  console.log(`SetUp Url Created ${SetUpUrl}`)
  try {
    EmailService.sendEmail(email,SetUpUrl)
    console.log(`Email Has been Sent Successfully .`)
    return res.status(200).send("Url has been sent" );
  } catch (error) {
    console.log(`Email Has not been Sent Successfully .`)
    return res.status(500).send({ error: error.message });
  }
});


router.post('/setup-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Hash the password
    const hashedPassword = await Encrypt.hashPassword(newPassword);

    // Update the user's password
    await user.findByIdAndUpdate(userId, { password: hashedPassword });

    res.status(200).json({ message: 'Password setup successful' });
  } catch (error) {
    console.error('Password setup error:', error);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});







router.post('/CreatePassword',verifyToken, async (req, res) => {
  const { email, newpassword } = req.body;
  const encriptedpassword = await Encrypt.hashPassword(newpassword);
  const User = await user.findOne({ email });
  if (User) {
      User.password = encriptedpassword;
      await User.save();
      return res.status(200).send({ message: 'Password set successfully' });
  } else {
      return res.status(200).send({ message: 'Account does not exist' });
  }
}  
);




router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
        
      // Check for missing fields
      if (!email || !password) {
        console.log(`${email} and ${password}`)
        console.log("Email and password are required.")
        return res.status(400).json({ success: false, message: "Email and password are required." });
      }
  
      // Find user by email
      const User = await user.findOne({ email });
      if (!User) {
        console.log(`invalid user ${User}`)
        return res.status(404).json({ success: false, message: "Account does not exist." });
      }
  
      // Check if account is active
      if (!User.AccountStatus) {
        console.log(`Account Status ${User.AccountStatus}`)
        return res.status(403).json({
          success: false,
          message: "Account is not active. Please contact support.",
          user: {
            name: User.name,
            email: User.email,
            role: User.role,
            passwordSet: !!User.password, // true if password exists
          },
        });
      }
  

  
      // Verify password
      const passwordMatch = await Encrypt.verifyPassword(password, User.password);
      if (!passwordMatch) {
        return res.status(401).json({ success: false, message: "Password is incorrect." });
      }
  
      // Generate token
      const payload = {
        name: User.name,
        email: User.email,
        role: User.role,
        AccountStatus: User.AccountStatus,
      };
      const genToken = await tokenService.generateToken(payload);
  
      if (!genToken) {
        return res.status(500).json({ success: false, message: "Failed to generate token. Please try again." });
      }
  
      // Set token as an HTTP-only cookie
      res.cookie("token", genToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "Strict",
        maxAge: 3600000, // 1 hour
      });
  
      // Send successful response
      return res.status(200).json({
        success: true,
        message: "Login successful.",
        user: {
          name: User.name,
          email: User.email,
          role: User.role,
        },
        token: genToken, // Include token if needed for frontend
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ success: false, message: "Internal server error. Please try again later." });
    }
  });
  
    



router.post('/logout', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
  
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
  
      const token = authHeader.split(' ')[1]; // Extract the token
      const payload = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
  
      if (!payload) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }
  
      // Clear token cookie (if applicable)
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
      });
  
      return res.status(200).json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      console.error('Logout error:', error);
      return res.status(500).json({
        success: false,
        message: 'Logout failed',
      });
    }
  });
  

router.post('/sendOTP', async (req, res) => {
    const { email } = req.body;
    try {
      const OTP = await OtpService.sendOTP(email);
      res.status(200).send({ OTP });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });

router.post('/verifyOTP', async (req, res) => {
    const { email, OTP } = req.body;
    try {
      const isValid = await OtpService.verifyOTP(email, OTP);
      res.status(200).send({ isValid });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });


router.put('/UpdatePassword',verifyToken, async (req, res) => {
    const { email, oldpassword, newpassword } = req.body;
    const User = await user.findOne({ email });
    const userPassword = User.password;
    const decryptpassword = await Encrypt.verifyPassword( oldpassword ,userPassword);
    if (User) {
        if (decryptpassword) {
            const encriptedpassword = await Encrypt.hashPassword(newpassword);
            User.password = encriptedpassword;
            await User.save();
            return res.status(200).send({ message: 'Password updated successfully' });
        } else {
            return res.status(200).send({ message: 'Old password is incorrect' });
        }
    } else {
        return res.status(200).send({ message: 'Account does not exist' });
    }
}
);






module.exports = router;