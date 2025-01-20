"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _addBudget = require("../controllers/addBudget.js");

var _authControllers = require("../controllers/authControllers.js");

var _validation = require("../validation/validation.js");

var _auth = _interopRequireDefault(require("../middleware/auth.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// budgetRoutes.js
var router = _express["default"].Router(); //router.use(protect);


router.use(_auth["default"]); // POST route to add a new budget

router.post('/create', (0, _validation.validateRequest)(_validation.budgetSchema), _addBudget.createBudget);
router.get('/getBudget/:id', _addBudget.getBudget);
router.patch('/updateBudget/:id', _addBudget.updateBudget);
router["delete"]('/deleteBudget/:id', _addBudget.deleteBudget);
router.get('/getAll', _addBudget.getAllBudget);
var _default = router;
exports["default"] = _default;