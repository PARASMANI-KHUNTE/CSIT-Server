const mongoose =require('mongoose')
const userSchema = new mongoose.Schema({
    name : {
        type : String,
    },
    email : {
        type : String,
        unique : true
    },
    password : {
        type : String
    },
    role : {
        type :String
    },
    AccountStatus : {
        type : Boolean,
        default : true
    }
})

const user = mongoose.model("user",userSchema);

module.exports = user;