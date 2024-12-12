"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var expenseSchema = new _mongoose["default"].Schema({
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
  link: {
    type: String
  },
  description: {
    type: String
  },
  attachment: {
    type: String
  }
}, {
  versionKey: false
});

var Expense = _mongoose["default"].model("Expense", expenseSchema);

var _default = Expense;
exports["default"] = _default;