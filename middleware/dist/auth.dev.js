"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _userModels = _interopRequireDefault(require("../models/userModels.js"));

var _util = require("util");

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

var SECRET_KEY = process.env.JWT_SECRET;

var isAuthenticated = function isAuthenticated(req, res, next) {
  var authHeader, token, decoded, userId, currentUser;
  return regeneratorRuntime.async(function isAuthenticated$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          authHeader = req.header('Authorization');
          console.log("Authorization Header:", authHeader); // Log the Authorization header for debugging

          if (!(!authHeader || !authHeader.startsWith('Bearer'))) {
            _context.next = 6;
            break;
          }

          console.log('Authorization header is missing.');
          return _context.abrupt("return", res.status(401).json({
            message: 'Unauthorized access: No token provided'
          }));

        case 6:
          token = authHeader.split(' ')[1]; // Extract token after "Bearer"

          console.log("Extracted Token:", token); // Log the extracted token

          if (token) {
            _context.next = 11;
            break;
          }

          console.log('Token is missing in the Authorization header.');
          return _context.abrupt("return", res.status(401).json({
            message: 'Unauthorized access: Malformed token'
          }));

        case 11:
          decoded = _jsonwebtoken["default"].verify(token, SECRET_KEY);
          console.log("Decoded Token:", decoded);

          if (decoded.id) {
            _context.next = 16;
            break;
          }

          console.log('Token is missing user ID.');
          return _context.abrupt("return", res.status(401).json({
            message: 'Invalid token: Missing user ID'
          }));

        case 16:
          //const decoded = await promisify(jwt.verify)(token, SECRET_KEY)
          console.log("DEcoded:", decoded.id);
          userId = decoded.id; //3) chech if user still exists using the ID in the payload

          _context.next = 20;
          return regeneratorRuntime.awrap(_userModels["default"].findById(userId));

        case 20:
          currentUser = _context.sent;
          console.log("Current userID:", currentUser);

          if (currentUser) {
            _context.next = 24;
            break;
          }

          return _context.abrupt("return", res.status(401).json({
            message: "The User belonging to this token no longer exist"
          }));

        case 24:
          //console.log("Current User", currentUser._id)
          req.user = currentUser;
          next();
          _context.next = 34;
          break;

        case 28:
          _context.prev = 28;
          _context.t0 = _context["catch"](0);
          console.log('Token Error.', _context.t0);

          if (!(_context.t0.name === 'JsonWebTokenError')) {
            _context.next = 33;
            break;
          }

          return _context.abrupt("return", res.status(401).json({
            message: 'Invalid token'
          }));

        case 33:
          return _context.abrupt("return", res.status(500).json({
            message: 'Internal Error here'
          }));

        case 34:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 28]]);
};

var _default = isAuthenticated;
exports["default"] = _default;