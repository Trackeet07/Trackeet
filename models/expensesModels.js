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
    role: {
        type: String
    },
    industry: {
        type: String
    },
    businessName: {
        type: String
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