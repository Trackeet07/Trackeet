import { Schema, model } from 'mongoose';

const userSchema = new Schema({
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
        required: true,
        select: false
    },
    passwordResetToken: Number,
    passwordResetExpires: Date,
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
    image: { 
        type: String,
      },
      createdAt: { 
        type: Date,
        default: Date.now(),
        select: false
      },
      isVerified: {
        type: Boolean,
        default: false,
      },
      confirmEmailToken: Number,
      confirmEmailTokenExpires: Date, 
},
{
    versionKey: false
});

const User = model("User", userSchema);

export default User;