const tokenService = require('./TokenService')

const generateSetupPasswordLink = async (userId) => {
    const token = await tokenService.generateTokenForPassword(userId);
    const baseUrl = 'http://localhost:5173/setup-password'; 
    return `${baseUrl}?token=${token}`;
  };




module.exports = {generateSetupPasswordLink};
  


