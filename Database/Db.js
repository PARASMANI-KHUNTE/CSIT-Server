const mongoose = require('mongoose');

MONGODB_URI=process.env.MONGODB_URI 
DB_NAME=process.env.DB_NAME
const dbcon = async () => {
    try {
        await mongoose.connect(`${MONGODB_URI}/${DB_NAME}`);
        console.log('Database connected successfully');
    } catch (error) {
        console.log('Database connection failed' + error);
    }
}


module.exports = dbcon;
