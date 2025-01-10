const argon2 = require('argon2');

// Function to hash a password
const hashPassword = async (password) => {
    try {
        if (!password || typeof password !== 'string') {
            throw new Error('Invalid password input');
        }
        const hash = await argon2.hash(password);
        return hash;
    } catch (err) {
        console.error('Error hashing password:', err.message || err);
        throw new Error('Hashing failed');
    }
};



// Function to verify a password against its hash
const verifyPassword = async (password, hashedPassword) => {
    try {
        const isMatch = await argon2.verify(hashedPassword, password);
        return isMatch; // Returns true if password matches, false otherwise
    } catch (err) {
        console.error('Error verifying password:', err.message || err);
        throw new Error('Verification failed');
    }
};

module.exports = {
    hashPassword,
    verifyPassword,
};
