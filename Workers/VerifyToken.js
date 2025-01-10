const jwt = require('jsonwebtoken');
const SecretKey = process.env.JWT_SECRET;

// Middleware to verify the token
const verifyToken = (req, res, next) => {
  try {
    // Extract token from cookies or Authorization header
    const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];

    // If no token is found, send an error response
    if (!token) {
      return res.status(401).json({ message: 'No token provided, authorization denied.' });
    }

    // Verify the token
    const decoded = jwt.verify(token, SecretKey);
    req.user = decoded; // Attach user information to the request object
    next(); // Proceed to the next middleware or route
  } catch (err) {
    console.error('Token verification error:', err.message);
    return res.status(401).json({ message: 'Token is not valid, authorization denied.' });
  }
};

module.exports = verifyToken;
