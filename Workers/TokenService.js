const jsonwebtoken = require('jsonwebtoken');

const generateToken = (payload) => {
    return jsonwebtoken.sign(payload, process.env.JWT_SECRET, { expiresIn: '1hr' });
}

const verifyToken = (token) => {
    return jsonwebtoken.verify(token, process.env.JWT_SECRET);
}

module.exports = { generateToken, verifyToken };