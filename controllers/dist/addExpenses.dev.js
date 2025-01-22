"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addExpense = void 0;

var _validation = require("../validation/validation.js");

var _expensesModels = _interopRequireDefault(require("../models/expensesModels.js"));

var _catchAsync = _interopRequireDefault(require("../middleware/catchAsync.js"));

var _httpStatus = _interopRequireDefault(require("http-status"));

var _userModels = _interopRequireDefault(require("../models/userModels.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Controller function to add an expense
var addExpense = function addExpense(req, res) {
  var _req$value$body, error, value, attachment, newExpense, savedExpense;

  return regeneratorRuntime.async(function addExpense$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 7;
          break;

        case 3:
          _context.prev = 3;
          _context.t0 = _context["catch"](0);
          console.log("EXPENSES ERROR", _context.t0.message);
          return _context.abrupt("return", res.status(_httpStatus["default"].INTERNAL_SERVER_ERROR).json({
            message: "An error occurred while adding expense."
          }));

        case 7:
          _req$value$body = req.value.body, error = _req$value$body.error, value = _req$value$body.value;

          if (!error) {
            _context.next = 11;
            break;
          }

          console.log("Errors", error);
          return _context.abrupt("return", res.status(_httpStatus["default"].NOT_FOUND).json({
            message: error.message
          }));

        case 11:
          // Get file path if an attachment is uploaded
          attachment = req.file ? req.file.path : null;
          req.value.body = _objectSpread({}, req.value.body, {
            author: req.user.id,
            attachment: attachment
          }); // Create a new expense

          _context.next = 15;
          return regeneratorRuntime.awrap(_expensesModels["default"].create(req.value.body));

        case 15:
          newExpense = _context.sent;
          _context.next = 18;
          return regeneratorRuntime.awrap(newExpense.save());

        case 18:
          savedExpense = _context.sent;
          // Send success response
          res.status(201).json({
            message: "Expense added successfully.",
            data: savedExpense
          });

        case 20:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 3]]);
}; // export const getAllExpenses = async (Request, res, next) => {
//     try {
//         const userID = req.user._id
//         console.log("USER ID:", userID)
//         if (!req.user || userID || !mongoose.Types.ObjectId.isValid(req.user._id)) {
//             return res.status(400).json({
//               status: 'error',
//               message: 'Invalid user ID',
//             });
//           }
//           const findUser = await User.findById(userID)
//           console.log("found User", findUser)
//           if(!)
//     }catch(error) {
//         console.log("An Error Occured", error.message)
//         return res.status(500).json({message: "An Internal Error Occured" })
//     }
// }
// Bodymassage: https://res.cloudinary.com/dydqejq1t/image/upload/v1737534148/Frame_469310_1_dhqpnp.png
// helicopter:https://res.cloudinary.com/dydqejq1t/image/upload/v1737534248/Frame_469310_2_gwrxup.png
// golf: https://res.cloudinary.com/dydqejq1t/image/upload/v1737534278/Frame_469310_3_yfpult.png
// droneView: https://res.cloudinary.com/dydqejq1t/image/upload/v1737534468/image_1_sy3cix.png
// happyFolks: https://res.cloudinary.com/dydqejq1t/image/upload/v1737534464/Frame_469310_12_dcbmkd.png
// theatre: https://res.cloudinary.com/dydqejq1t/image/upload/v1737534463/image_5_wsor8i.png
// glassbuilding: https://res.cloudinary.com/dydqejq1t/image/upload/v1737534462/image_7_dofgbu.png
// 3dLawn: https://res.cloudinary.com/dydqejq1t/image/upload/v1737534461/image_6_blp5aq.png
// niceInteriror: https://res.cloudinary.com/dydqejq1t/image/upload/v1737534460/image_4_cuswzn.png
// suits: https://res.cloudinary.com/dydqejq1t/image/upload/v1737534459/image_3_ynrtc2.png
// skyScrapper: https://res.cloudinary.com/dydqejq1t/image/upload/v1737534458/image_2_mrqaib.png
// reception: https://res.cloudinary.com/dydqejq1t/image/upload/v1737534457/Frame_469310_qjeeow.png
// tank: https://res.cloudinary.com/dydqejq1t/image/upload/v1737534456/Frame_469310_17_ia3lpn.png
// doctors: https://res.cloudinary.com/dydqejq1t/image/upload/v1737534455/Frame_469310_16_ubsqf1.png
// hijabSister: https://res.cloudinary.com/dydqejq1t/image/upload/v1737534454/Frame_469310_15_nyymai.png
// hijabSisterBigger: https://res.cloudinary.com/dydqejq1t/image/upload/v1737534454/Frame_469310_14_myw9fo.png
// raceTrack: https://res.cloudinary.com/dydqejq1t/image/upload/v1737534453/Frame_469310_13_wzgxft.png
// schoolUniform: https://res.cloudinary.com/dydqejq1t/image/upload/v1737534451/Frame_469310_11_q4e5ig.png
// CafeMeeting: https://res.cloudinary.com/dydqejq1t/image/upload/v1737534450/Frame_469310_10_gyqcov.png
// guysHangout: https://res.cloudinary.com/dydqejq1t/image/upload/v1737534449/image_u5fbxp.png
// poolside:https://res.cloudinary.com/dydqejq1t/image/upload/v1737534449/Frame_469310_9_lb10au.png
// powerline: https://res.cloudinary.com/dydqejq1t/image/upload/v1737534448/image_8_umytg1.png
// gym: https://res.cloudinary.com/dydqejq1t/image/upload/v1737534418/Frame_469310_7_d2trmy.png
// poolView: https://res.cloudinary.com/dydqejq1t/image/upload/v1737534395/Frame_469310_4_lzyted.png
// girlInRed: https://res.cloudinary.com/dydqejq1t/image/upload/v1737534400/Frame_469310_5_cbncvk.png
// apartments: https://res.cloudinary.com/dydqejq1t/image/upload/v1737534403/Frame_469310_6_s0gtl7.png
// resturant: https://res.cloudinary.com/dydqejq1t/image/upload/v1737534416/Frame_469310_8_yxqtvp.png


exports.addExpense = addExpense;