"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updatePassword = exports.updateEmail = exports.updatePhoneNumber = exports.updateTransactionSchema = exports.setTransactionSchema = exports.initiateCardPaymentSchema = exports.amountTrf = exports.walletDetails = exports.validateMongoDbId = exports.analysisSchema = exports.resetPasswordSchema = exports.verifyFgPassOTPSchema = exports.forgetPassSchema = exports.budgetSchema = exports.expenseSchema = exports.businessSchema = exports.registerSchema = exports.loginSchema = exports.residentSchema = exports.setLoginSchema = exports.bvnSchema = exports.otpSchema = exports.requiredPhoneSchema = exports.schemas = exports.validateRequest = void 0;

var _joi = _interopRequireDefault(require("joi"));

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var validateRequest = function validateRequest(schema) {
  return function (req, res, next) {
    var _schema$validate = schema.validate(req.body, {
      abortEarly: false
    }),
        error = _schema$validate.error;

    if (error) {
      return res.status(400).json({
        message: error.details[0].message
      });
    }

    if (!req.value) {
      req.value = {}; // create an empty object the request value doesn't exist yet
    }

    req.value["body"] = req.body;
    next();
  };
};

exports.validateRequest = validateRequest;

var registerSchema = _joi["default"].object({
  personalName: _joi["default"].string().required().messages({
    'any.required': 'Personal Name is required'
  }),
  // role: Joi.string().valid('admin', 'user').required().messages({
  //   'any.only': 'Role must be one of: admin, user', 
  //   'any.required': 'Role is required'
  // }),
  email: _joi["default"].string().lowercase().email({
    minDomainSegments: 2,
    tlds: {
      allow: ['com', 'net']
    }
  }).required().messages({
    'string.base': 'Email should be a type of string',
    'string.empty': 'Email cannot be empty',
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required'
  }),
  country: _joi["default"].string().required().messages({
    'any.required': 'Country is required',
    'string.base': 'Country must be a valid string'
  }),
  password: _joi["default"].string().min(8).pattern(/[A-Z]/).pattern(/[0-9]/).pattern(/[\W_]/).required().messages({
    'string.base': 'Password should be a type of string',
    'string.empty': 'Password cannot be empty',
    'string.min': 'Password should have at least 8 characters',
    'string.pattern.base': 'Password must include at least one uppercase letter, one number, and one special character',
    'any.required': 'Password is required'
  })
});

exports.registerSchema = registerSchema;

var businessSchema = _joi["default"].object({
  personalName: _joi["default"].string().required().messages({
    'any.required': 'Personal Name is required'
  }),
  businessName: _joi["default"].string().required().messages({
    'any.required': 'Business Name is required'
  }),
  role: _joi["default"].string().required().messages({
    'any.required': 'Role is required'
  }),
  industry: _joi["default"].string().required().messages({
    'any.required': 'Industry is required'
  }),
  email: _joi["default"].string().lowercase().email({
    minDomainSegments: 2,
    tlds: {
      allow: ['com', 'net']
    }
  }).required().messages({
    'string.base': 'Email should be a type of string',
    'string.empty': 'Email cannot be empty',
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required'
  }),
  country: _joi["default"].string().required().messages({
    'any.required': 'Country is required',
    'string.base': 'Country must be a valid string'
  }),
  password: _joi["default"].string().min(8).pattern(/[A-Z]/).pattern(/[0-9]/).pattern(/[\W_]/).required().messages({
    'string.base': 'Password should be a type of string',
    'string.empty': 'Password cannot be empty',
    'string.min': 'Password should have at least 8 characters',
    'string.pattern.base': 'Password must include at least one uppercase letter, one number, and one special character',
    'any.required': 'Password is required'
  })
});

exports.businessSchema = businessSchema;

var expenseSchema = _joi["default"].object({
  expenseName: _joi["default"].string().required().messages({
    'any.required': 'Expense name is required'
  }),
  amount: _joi["default"].number().positive().required().messages({
    'any.required': 'Amount is required'
  }),
  date: _joi["default"].date().required().messages({
    'any.required': 'Date is required',
    'date.base': 'Event date must be a valid date'
  }),
  category: _joi["default"].string().required().messages({
    'any.required': 'Category is required'
  }),
  link: _joi["default"].string().messages({
    'any.required': 'Input Url Text'
  })
});

exports.expenseSchema = expenseSchema;

var residentSchema = _joi["default"].object({
  fullName: _joi["default"].string().required().messages({
    'any.required': 'Full Name is required'
  }),
  email: _joi["default"].string().lowercase().email({
    minDomainSegments: 2,
    tlds: {
      allow: ['com', 'net']
    }
  }).required().messages({
    'string.base': 'Email should be a type of string',
    'string.empty': 'Email cannot be empty',
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required'
  }),
  phoneNumber: _joi["default"].string().pattern(/^[0-9]{10}$/) // Validates exactly 10 digits (e.g., a US phone number)
  .required().messages({
    'string.pattern.base': 'Phone number must be exactly 10 digits'
  }),
  profession: _joi["default"].string().required().messages({
    'any.required': 'Profession is required'
  }),
  interest: _joi["default"].string().required().messages({
    'any.required': 'Information is required'
  }),
  residentType: _joi["default"].string().required().messages({
    "string.base": "Type of resident required"
  }),
  moveInDate: _joi["default"].date().iso().required().messages({
    'date.base': 'Birth date must be a valid date',
    'date.format': 'Birth date must be in ISO format (YYYY-MM-DD)'
  })
});

exports.residentSchema = residentSchema;

var budgetSchema = _joi["default"].object({
  budgetName: _joi["default"].string().required().messages({
    'any.required': 'Budget name is required'
  }),
  // customBudgetName: Joi.string(),
  totalBudget: _joi["default"].number().positive().required().messages({
    'any.required': 'Total Budget is required'
  }),
  duration: _joi["default"].string().required().messages({
    'any.required': 'Duration is required'
  })
});

exports.budgetSchema = budgetSchema;

var validateMongoDbId = function validateMongoDbId(id) {
  var isValid = _mongoose["default"].Types.ObjectId.isValid(id);

  if (!isValid) throw new Error("this id is not valid or not found");
};

exports.validateMongoDbId = validateMongoDbId;

var schemas = _joi["default"].object({
  firstName: _joi["default"].string().required(),
  lastName: _joi["default"].string().required(),
  email: _joi["default"].string().email({
    minDomainSegments: 2,
    tlds: {
      allow: ["com", "net"]
    }
  }).required(),
  password: _joi["default"].string().min(8).trim().required().messages({
    "string.pattern.base": "Password should be 8 characters and contain letters or numbers only",
    "string.empty": "Password cannot be empty",
    "any.required": "Password is required"
  }),
  phone: _joi["default"].string().max(10).pattern(/[6-9]{1}[0-9]{9}/).optional(),
  phoneOtp: _joi["default"].string().optional(),
  emailOtp: _joi["default"].string().optional(),
  role: _joi["default"].string().valid("super admin", "admin", "user")["default"]("user").optional(),
  token: _joi["default"].string().optional()
});

exports.schemas = schemas;

var requiredPhoneSchema = _joi["default"].object({
  phone: _joi["default"].string().max(10).pattern(/[6-9]{1}[0-9]{9}/).required(),
  countryCode: _joi["default"].string().max(5).required()
});

exports.requiredPhoneSchema = requiredPhoneSchema;

var otpSchema = _joi["default"].object({
  otp: _joi["default"].string().min(6).max(6).required()
});

exports.otpSchema = otpSchema;

var bvnSchema = _joi["default"].object({
  bvn: _joi["default"].string().min(11).max(11).required()
});

exports.bvnSchema = bvnSchema;

var setLoginSchema = _joi["default"].object({
  loginPin: _joi["default"].string().min(6).max(6).required()
});

exports.setLoginSchema = setLoginSchema;

var loginSchema = _joi["default"].object({
  email: _joi["default"].string().lowercase().email({
    minDomainSegments: 2,
    tlds: {
      allow: ['com', 'net']
    }
  }).required().messages({
    'string.base': 'Email should be a type of string',
    'string.empty': 'Email cannot be empty',
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required'
  }),
  password: _joi["default"].string().min(8).pattern(/[A-Z]/).pattern(/[0-9]/).pattern(/[\W_]/).required().messages({
    'string.base': 'Password should be a type of string',
    'string.empty': 'Password cannot be empty',
    'string.min': 'Password should have at least 8 characters',
    'string.pattern.base': 'Password must include at least one uppercase letter, one number, and one special character',
    'any.required': 'Password is required'
  })
});

exports.loginSchema = loginSchema;

var forgetPassSchema = _joi["default"].object({
  email: _joi["default"].string().lowercase().email({
    minDomainSegments: 2,
    tlds: {
      allow: ['com', 'net']
    }
  }).required().messages({
    'string.base': 'Email should be a type of string',
    'string.empty': 'Email cannot be empty',
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required'
  })
});

exports.forgetPassSchema = forgetPassSchema;

var verifyFgPassOTPSchema = _joi["default"].object({
  resetOTP: _joi["default"].string().min(6).max(6).required()
});

exports.verifyFgPassOTPSchema = verifyFgPassOTPSchema;

var analysisSchema = _joi["default"].object({
  goals: _joi["default"].string()
});

exports.analysisSchema = analysisSchema;

var walletDetails = _joi["default"].object({
  recipientDetails: _joi["default"].string().required()
});

exports.walletDetails = walletDetails;

var amountTrf = _joi["default"].object({
  recipientId: _joi["default"].string().required(),
  amount: _joi["default"].number().required(),
  recipientName: _joi["default"].string().required(),
  remark: _joi["default"].string(),
  budgetId: _joi["default"].string(),
  transactionPin: _joi["default"].number().required()
});

exports.amountTrf = amountTrf;

var initiateCardPaymentSchema = _joi["default"].object({
  amount: _joi["default"].number().required(),
  paymentDescription: _joi["default"].string().required()
});

exports.initiateCardPaymentSchema = initiateCardPaymentSchema;

var setTransactionSchema = _joi["default"].object({
  transactionPin: _joi["default"].number().required()
});

exports.setTransactionSchema = setTransactionSchema;

var updateTransactionSchema = _joi["default"].object({
  oldPin: _joi["default"].number().required(),
  newPin: _joi["default"].number().required()
});

exports.updateTransactionSchema = updateTransactionSchema;

var updatePhoneNumber = _joi["default"].object({
  phone: _joi["default"].string().max(10).pattern(/[6-9]{1}[0-9]{9}/).optional()
});

exports.updatePhoneNumber = updatePhoneNumber;

var updateEmail = _joi["default"].object({
  email: _joi["default"].string().email({
    minDomainSegments: 2,
    tlds: {
      allow: ["com", "net"]
    }
  }).required()
});

exports.updateEmail = updateEmail;

var passwordSchema = _joi["default"].string().min(8).max(25).trim().pattern(/[A-Z]/).pattern(/[0-9]/).pattern(/[\W_]/).required().messages({
  'string.base': 'Password should be a type of string',
  'string.empty': 'Password cannot be empty',
  'string.min': 'Password should have at least 8 characters',
  'string.pattern.base': 'Password must include at least one uppercase letter, one number, and one special character',
  'any.required': 'Password is required'
});

var updatePassword = _joi["default"].object({
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
  confirmPassword: _joi["default"].valid(_joi["default"].ref('newPassword')).required()
});

exports.updatePassword = updatePassword;

var resetPasswordSchema = _joi["default"].object({
  newPassword: passwordSchema,
  confirmPassword: _joi["default"].valid(_joi["default"].ref('newPassword')).required()
});

exports.resetPasswordSchema = resetPasswordSchema;