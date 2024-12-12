"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = require("mongoose");

var userSchema = new _mongoose.Schema({
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
  // role: {
  //     type: String
  // },
  // industry: {
  //     type: String
  // },
  // businessName: {
  //     type: String
  // },
  resetPasswordToken: {
    type: String
  },
  image: {
    type: String
  },
  createdAt: {
    type: Date,
    "default": Date.now(),
    select: false
  },
  isVerified: {
    type: Boolean,
    "default": false
  },
  confirmEmailToken: Number,
  confirmEmailTokenExpires: Date
}, {
  versionKey: false
});
var User = (0, _mongoose.model)("User", userSchema);
var _default = User;
exports["default"] = _default;