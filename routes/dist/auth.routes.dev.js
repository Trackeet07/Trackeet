"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireWildcard(require("express"));

var _authControllers = require("../controllers/authControllers.js");

var _validation = require("../validation/validation.js");

var _auth = _interopRequireDefault(require("../middleware/auth.js"));

var _picValid = _interopRequireDefault(require("../middleware/picValid.js"));

var _multer = _interopRequireDefault(require("../public/multer.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var router = _express["default"].Router(); //USER


router.post('/signup', (0, _validation.validateRequest)(_validation.registerSchema), _authControllers.personalSignup);
router.post('/verify-user-email', _authControllers.verifyUserEmail);
router.post('/login-user', (0, _validation.validateRequest)(_validation.loginSchema), _authControllers.loginUser);
router.post('/forgot-user-password', (0, _validation.validateRequest)(_validation.forgetPassSchema), _authControllers.forgotUserPassword);
router.post('/reset-user', _authControllers.resetUserPassword);
router["delete"]('/delete/:id', _authControllers.deleteUser);
router.post('/picture', _auth["default"], _multer["default"].single("picture"), _authControllers.uploadPicture); //Business

router.post('/business', (0, _validation.validateRequest)(_validation.businessSchema), _authControllers.businessSignup);
router.post('/verify-business-email', _authControllers.verifyBusinessEmail);
router.post('/login-business', (0, _validation.validateRequest)(_validation.loginSchema), _authControllers.loginBusiness);
router.post('/reset-business', _authControllers.resetBusinessPassword);
router.post('/forgot-business-password', (0, _validation.validateRequest)(_validation.forgetPassSchema), _authControllers.forgotBusinessPassword);
router["delete"]('/delete-business/:id', _authControllers.deleteBusiness);
router.post('/business-picture/:id', _multer["default"].single("picture"), _authControllers.uploadBusinessPicture);
var _default = router;
exports["default"] = _default;