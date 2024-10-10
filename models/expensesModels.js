const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    expenseName: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    date: {
        type: Date,
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