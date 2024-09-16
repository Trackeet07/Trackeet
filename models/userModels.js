const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    personalName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false,
        required: true,
    },
    resetPasswordToken: {
        type: String,
      },

},
{
    versionKey: false
});

const User = mongoose.model("User", userSchema);

module.exports = User;