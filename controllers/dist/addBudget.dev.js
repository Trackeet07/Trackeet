"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllBudget = exports.deleteBudget = exports.updateBudget = exports.getBudget = exports.createBudget = void 0;

var _budgetModels = _interopRequireDefault(require("../models/budgetModels.js"));

var _catchAsync = _interopRequireDefault(require("../middleware/catchAsync.js"));

var _httpStatus = _interopRequireDefault(require("http-status"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Controller function to add a budget
var createBudget = (0, _catchAsync["default"])(function _callee(req, res) {
  var _req$value$body, error, value, newBudget, savedBudget;

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
          req.value.body = _objectSpread({}, value, {
            user: req.user._id
          }); // Create a new budget

          _context.next = 7;
          return regeneratorRuntime.awrap(_budgetModels["default"].create(req.value.body));

        case 7:
          newBudget = _context.sent;
          _context.next = 10;
          return regeneratorRuntime.awrap(newBudget.save());

        case 10:
          savedBudget = _context.sent;
          // Send success response
          res.status(201).json({
            message: "Budget added successfully.",
            data: savedBudget
          });

        case 12:
        case "end":
          return _context.stop();
      }
    }
  });
}); //GEt Budget

exports.createBudget = createBudget;
var getBudget = (0, _catchAsync["default"])(function _callee2(req, res, next) {
  var budget;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(_budgetModels["default"].findById(req.params.id));

        case 2:
          budget = _context2.sent;

          if (budget) {
            _context2.next = 6;
            break;
          }

          console.log("BUDGET>>", budget);
          return _context2.abrupt("return", res.status(_httpStatus["default"].UNAUTHORIZED).json({
            message: "No budget found with that ID"
          }));

        case 6:
          res.status(_httpStatus["default"].OK).json({
            status: "Success",
            data: {
              budget: budget
            }
          });

        case 7:
        case "end":
          return _context2.stop();
      }
    }
  });
}); // Update budget

exports.getBudget = getBudget;
var updateBudget = (0, _catchAsync["default"])(function _callee3(req, res, next) {
  var budget;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(_budgetModels["default"].findByIdAndUpdate(req.params.id, req.body, {
            "new": true,
            runValidators: true
          }));

        case 2:
          budget = _context3.sent;

          if (budget) {
            _context3.next = 5;
            break;
          }

          return _context3.abrupt("return", res.status(_httpStatus["default"].NOT_FOUND).json({
            message: "No Budget found with that id"
          }));

        case 5:
          res.status(_httpStatus["default"].OK).json({
            status: "Success",
            message: "Budget updated",
            data: {
              budget: budget
            }
          });

        case 6:
        case "end":
          return _context3.stop();
      }
    }
  });
}); //DELETE BUDGET

exports.updateBudget = updateBudget;
var deleteBudget = (0, _catchAsync["default"])(function _callee4(req, res, next) {
  var budget;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(_budgetModels["default"].findByIdAndDelete(req.params.id));

        case 2:
          budget = _context4.sent;

          if (budget) {
            _context4.next = 5;
            break;
          }

          return _context4.abrupt("return", res.status(_httpStatus["default"].NOT_FOUND).json({
            messahe: "No Budget found with that ID"
          }));

        case 5:
          res.status(_httpStatus["default"].NO_CONTENT).json({
            status: "success",
            data: null
          });

        case 6:
        case "end":
          return _context4.stop();
      }
    }
  });
}); //GET  ALL BUDGET

exports.deleteBudget = deleteBudget;
var getAllBudget = (0, _catchAsync["default"])(function _callee5(req, res, next) {
  var page, limit, skip, numBudgets, budgets;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          // Get page and limit from query parameters, default to page 1 and limit 10
          page = parseInt(req.query.page, 10) || 1;
          limit = parseInt(req.query.limit, 3) || 3;
          skip = (page - 1) * limit; // Fetch total number of books

          _context5.next = 5;
          return regeneratorRuntime.awrap(_budgetModels["default"].countDocuments());

        case 5:
          numBudgets = _context5.sent;

          if (!(skip >= numBudgets)) {
            _context5.next = 8;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            status: 'fail',
            message: 'This page does not exist'
          }));

        case 8:
          _context5.next = 10;
          return regeneratorRuntime.awrap(_budgetModels["default"].find().skip(skip).limit(limit));

        case 10:
          budgets = _context5.sent;
          // Respond with paginated budgets
          res.status(200).json({
            status: 'success',
            results: budgets.length,
            data: {
              budgets: budgets,
              totalPages: Math.ceil(numBudgets / limit),
              currentPage: page
            }
          });

        case 12:
        case "end":
          return _context5.stop();
      }
    }
  });
});
exports.getAllBudget = getAllBudget;