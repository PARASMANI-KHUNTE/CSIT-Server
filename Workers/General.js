const generateSessionId = (courseType) => {
    const year = new Date().getFullYear().toString().slice(-2);
    const randomPart = Math.random().toString(36).substring(2, 4).toUpperCase(); // 2 random letters
    const randomDigits = Math.floor(10 + Math.random() * 90); // 2 random digits
    return `CSIT/${year}/${courseType}/${randomPart}${randomDigits}`;
};


const generateStudentId = (courseType) => {
    const year = new Date().getFullYear().toString().slice(-2);
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase(); // 4 random letters
    const randomDigits = Math.floor(1000 + Math.random() * 9000); // 4 random digits
    return `CSIT/${year}/${courseType}/${randomPart}${randomDigits}`;
};
const generatePassword = () => Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit password

module.exports = { generateSessionId , generateStudentId , generatePassword };