const bcrypt = require("bcryptjs");
const cloudinary = require('../public/cloudinary.js');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require("uuid");
const User = require("../models/userModels.js");
// const { emailSender } = require('../middleware/emailotp.js');
exports.personalSignup = async (req, res) => {
    try {
        const { personalName, password, email, country } = req.body;

        if (!personalName || !email || !password || !country) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }
        const passwordRegex = /^(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long and must contain one special character.."
            });
        }

        const existingUser = await User.findOne({ email });
        console.log(existingUser);

        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            personalName,
            password: hashedPassword,
            email,
            country
        });
console.log(newUser);
  
        await newUser.save();

        // await emailSender(newUser);
        // await sendSms(newUser);

        return res.status(201).json({ message: "User saved successfully", newUser });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error saving user", error: err.message });
    }
};

exports.bussinessSignup = async (req, res) => {
    try {
        const { personalName, businessName, role, industry, password, email, country } = req.body;

        if (!personalName || !businessName || !role || !industry || !email || !password || !country) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }
        const passwordRegex = /^(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long and must contain one special character."
            });
        }

        const existingUser = await User.findOne({ email });
        console.log(existingUser);

        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            personalName,
            password: hashedPassword,
            email,
            country,
            businessName,
            role,
            industry
        });
console.log(newUser);
  
        await newUser.save();

        // await emailSender(newUser);

        return res.status(201).json({ message: "User saved successfully", newUser });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error saving user", error: err.message });
    }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please input your email and password" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User Not Found, Please Signup" });
    }

    const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword) {
      return res.status(400).json({ message: "Incorrect Password" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30s' });

    return res
      .status(200)
      .json({ message: "User is Logged In Successfully", user, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error Logging In User", err });
  }
};


  exports.forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Please input your email" });
      }
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const token = uuidv4();
  
      user.resetPasswordToken = token;
      await user.save();
  
      // await emailResetPassword(email, token);
  
      return res.status(200).json({ message: "Check your email to reset your password", });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error saving user", err });
    }
  };

  exports.resetPassword = async (req, res) => {
    try {
      const { token } = req.params;
      const { newPassword, confirmPassword } = req.body;
  
      if (!token) {
        return res.status(400).json({ message: "Please input your reset token" });
      }
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }
  
      const user = await User.findOne({
        resetPasswordToken: token
      });
  
      if (!user) {
        return res.status(400).json({ message: "Invalid reset token" });
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
  
      await user.save();
  
      return res.status(200).json({ message: "Password reset successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error resetting password", err });
    }
  };

  exports.uploadPicture = async (req, res) => {
    try {
    
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const result = await cloudinary.uploader.upload(req.file.path);

        const updatedTrain = await Train.findByIdAndUpdate(
            req.params.id,
            { image: result.secure_url },
            { new: true } 
        );

        return res.status(200).json({
            message: "Picture uploaded successfully",
            data: updatedTrain,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error uploading picture", error: err });
    }
};


  exports.deleteUser = async (req, res) => {
    try {
      const { id } = req.query;
  
      const deletedUser = await User.findByIdAndDelete({
        _id: id,
      });
  
      res.status(200).json({
        message: "User Deleted Successfully",
        deletedUser,
      });
    } catch (error) {
      res.status(500).json({ error, message: "Error Deleting User" });
    }
  };