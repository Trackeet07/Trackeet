"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _addExpenses = require("../controllers/addExpenses.js");

var _validation = require("../validation/validation.js");

var _multer = _interopRequireDefault(require("../public/multer.js"));

var _auth = _interopRequireDefault(require("../middleware/auth.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

router.use(_auth["default"]);
router.post('/create', (0, _validation.validateRequest)(_validation.expenseSchema), _multer["default"].single('attachment'), _addExpenses.addExpense);
var _default = router;
exports["default"] = _default;