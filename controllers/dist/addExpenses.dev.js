"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addExpense = void 0;

var _validation = require("../validation/validation.js");

var _expensesModels = _interopRequireDefault(require("../models/expensesModels.js"));

var _catchAsync = _interopRequireDefault(require("../middleware/catchAsync.js"));

var _httpStatus = _interopRequireDefault(require("http-status"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Controller function to add an expense
var addExpense = (0, _catchAsync["default"])(function _callee(req, res) {
  var _req$value$body, error, value, attachment, newExpense, savedExpense;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$value$body = req.value.body, error = _req$value$body.error, value = _req$value$body.value;

          if (!error) {
            _context.next = 4;
            break;
          }

          console.log("Errors", error);
          return _context.abrupt("return", res.status(_httpStatus["default"].NOT_FOUND).json({
            message: error.message
          }));

        case 4:
          // Get file path if an attachment is uploaded
          attachment = req.file ? req.file.path : null;
          req.value.body = _objectSpread({}, req.value.body, {
            attachment: attachment
          }); // Create a new expense

          _context.next = 8;
          return regeneratorRuntime.awrap(_expensesModels["default"].create(req.value.body));

        case 8:
          newExpense = _context.sent;
          _context.next = 11;
          return regeneratorRuntime.awrap(newExpense.save());

        case 11:
          savedExpense = _context.sent;
          // Send success response
          res.status(201).json({
            message: "Expense added successfully.",
            data: savedExpense
          });

        case 13:
        case "end":
          return _context.stop();
      }
    }
  });
});
exports.addExpense = addExpense;