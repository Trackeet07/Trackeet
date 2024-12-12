"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = require("mongoose");

var _ref;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var businessSchema = new _mongoose.Schema((_ref = {
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
  businessName: {
    type: String,
    required: true
  },
  role: {
    type: String
  },
  industry: {
    type: String
  }
}, _defineProperty(_ref, "businessName", {
  type: String
}), _defineProperty(_ref, "resetPasswordToken", {
  type: String
}), _defineProperty(_ref, "image", {
  type: String
}), _defineProperty(_ref, "createdAt", {
  type: Date,
  "default": Date.now(),
  select: false
}), _defineProperty(_ref, "isVerified", {
  type: Boolean,
  "default": false
}), _defineProperty(_ref, "confirmEmailToken", Number), _defineProperty(_ref, "confirmEmailTokenExpires", Date), _ref), {
  versionKey: false
});
var Business = (0, _mongoose.model)("Business", businessSchema);
var _default = Business;
exports["default"] = _default;