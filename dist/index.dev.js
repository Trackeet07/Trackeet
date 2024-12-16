"use strict";

var _app = _interopRequireDefault(require("./app.js"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _logger = _interopRequireDefault(require("./utils/log/logger.js"));

var _db = _interopRequireDefault(require("./database/db.js"));

var _emailSender = require("./utils/email/email-sender.js");

var _cloudinary = require("cloudinary");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

_cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
}); // const url = cloudinary.url("trackeet")
// console.log("URL", url)


(function _callee() {
  var results, url;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(_cloudinary.v2.uploader.upload("./public/images/Logomark.svg"));

        case 2:
          results = _context.sent;
          console.log("RESULTS", results);
          url = _cloudinary.v2.url(results.public_id, {//   transformation: [
            //     {
            //     quality: "auto", 
            //     fetch_format: "auto"
            //   },
            //   {
            //     width: 1200, 
            //     height: 1200,
            //     crop: "fill",
            //     gravity: "auto"
            //   }
            // ]
          });

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
})(); // const url = cloudinary.url("Section_bhthbc", {
//   transformation: [
//     {
//     quality: "auto"
//   },
//   {
//     fetch_format: "auto"
//   },
//   {
//     width: 1200
//   }
// ]
// }
// );
// console.log(url)


process.on("uncaughtException", function (err) {
  console.log('UNCAUGHT EXCEPTION!,  SHUTTING DOWN........');
  console.log(err);
  console.log(err.name, err.message);
  process.exit(1);
});
var port = process.env.PORT || 1800;

_dotenv["default"].config();

var server = _app["default"].listen(port, function _callee2() {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap((0, _db["default"])(process.env.MONGODB_URL));

        case 3:
          console.log("Database connected successfully");

          _logger["default"].info("Server is running on port ".concat(port));

          _context2.next = 11;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);

          _logger["default"].error(_context2.t0);

          (0, _emailSender.sendServerFailure)();

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
});

process.on("unhandledRejection", function (err) {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION!!! SHUTTING DOWN...");
  server.close(function () {
    process.exit(1);
  });
});