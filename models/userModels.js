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
    image: {
        type: String,
      }

},
{
    versionKey: false
});

const User = model("User", userSchema);

export default User;