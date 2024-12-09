import Joi from "joi";
import mongoose from "mongoose";

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }
    if (!req.value) {
      req.value = {}; // create an empty object the request value doesn't exist yet
    }
    req.value["body"] = req.body;
    next();
  };
};

const registerSchema = Joi.object({
  personalName: Joi.string().required().messages({
    'any.required': 'Personal Name is required'
  }),
  // role: Joi.string().valid('admin', 'user').required().messages({
  //   'any.only': 'Role must be one of: admin, user', 
  //   'any.required': 'Role is required'
  // }),
  email: Joi.string().lowercase().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().messages({
    'string.base': 'Email should be a type of string',
    'string.empty': 'Email cannot be empty',
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required'
  }),
  country: Joi.string().required().messages({
    'any.required': 'Country is required',
    'string.base': 'Country must be a valid string',
  }),
  password: Joi.string().min(8).pattern(/[A-Z]/).pattern(/[0-9]/).pattern(/[\W_]/).required().messages({
    'string.base': 'Password should be a type of string',
    'string.empty': 'Password cannot be empty',
    'string.min': 'Password should have at least 8 characters',
    'string.pattern.base': 'Password must include at least one uppercase letter, one number, and one special character',
    'any.required': 'Password is required'
  }),

  
})

const businessSchema = Joi.object({
  personalName: Joi.string().required().messages({
    'any.required': 'Personal Name is required'
  }),
  businessName: Joi.string().required().messages({
    'any.required': 'Personal Name is required'
  }),
  role: Joi.string().required().messages({
    'any.required': 'Role is required'
  }),
  industryName: Joi.string().required().messages({
    'any.required': 'Role is required'
  }),
  email: Joi.string().lowercase().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().messages({
    'string.base': 'Email should be a type of string',
    'string.empty': 'Email cannot be empty',
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required'
  }),
  country: Joi.string().required().messages({
    'any.required': 'Country is required',
    'string.base': 'Country must be a valid string',
  }),
  password: Joi.string().min(8).pattern(/[A-Z]/).pattern(/[0-9]/).pattern(/[\W_]/).required().messages({
    'string.base': 'Password should be a type of string',
    'string.empty': 'Password cannot be empty',
    'string.min': 'Password should have at least 8 characters',
    'string.pattern.base': 'Password must include at least one uppercase letter, one number, and one special character',
    'any.required': 'Password is required'
  }),

  
})

const expenseSchema = Joi.object({
  expenseName: Joi.string().required().messages({
    'any.required': 'Expense name is required'
  }),
  amount: Joi.number().positive().required().messages({
    'any.required': 'Amount is required'
  }),
  date: Joi.date().required().messages({
    'any.required': 'Date is required',
    'date.base': 'Event date must be a valid date',
  }),
  category: Joi.string().required().messages({
    'any.required': 'Category is required'
  }),
});
const residentSchema = Joi.object({
  fullName: Joi.string().required().messages({
    'any.required': 'Full Name is required'
  }),
  email: Joi.string().lowercase().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().messages({
    'string.base': 'Email should be a type of string',
    'string.empty': 'Email cannot be empty',
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required'
  }),
  phoneNumber: Joi.string()
  .pattern(/^[0-9]{10}$/) // Validates exactly 10 digits (e.g., a US phone number)
  .required()
  .messages({
    'string.pattern.base': 'Phone number must be exactly 10 digits',
  }),
  profession: Joi.string().required().messages({
    'any.required': 'Profession is required'
  }),
  interest: Joi.string().required().messages({
    'any.required': 'Information is required'
  }),
  residentType: Joi.string().required().messages({"string.base":"Type of resident required"}),
  moveInDate: Joi.date().iso().required()
  .messages({
    'date.base': 'Birth date must be a valid date',
    'date.format': 'Birth date must be in ISO format (YYYY-MM-DD)',
  }) ,
  
})

const budgetSchema = Joi.object({
  budgetName: Joi.string().required().messages({
    'any.required': 'Budget name is required'
  }),
  // customBudgetName: Joi.string(),
  totalBudget: Joi.number().positive().required().messages({
    'any.required': 'Total Budget is required'
  }),
  duration: Joi.string().required().messages({
    'any.required': 'Duration is required'
  }),
});

const validateMongoDbId = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) throw new Error("this id is not valid or not found");
};

const schemas = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: Joi.string().min(8).trim().required().messages({
    "string.pattern.base": `Password should be 8 characters and contain letters or numbers only`,
    "string.empty": `Password cannot be empty`,
    "any.required": `Password is required`,
  }),
  phone: Joi.string()
    .max(10)
    .pattern(/[6-9]{1}[0-9]{9}/)
    .optional(),
  phoneOtp: Joi.string().optional(),
  emailOtp: Joi.string().optional(),
  role: Joi.string()
    .valid("super admin", "admin", "user")
    .default("user")
    .optional(),
  token: Joi.string().optional(),
});

const requiredPhoneSchema = Joi.object({
  phone: Joi.string()
    .max(10)
    .pattern(/[6-9]{1}[0-9]{9}/)
    .required(),
  countryCode: Joi.string().max(5).required(),
});

const otpSchema = Joi.object({
  otp: Joi.string().min(6).max(6).required(),
});

const bvnSchema = Joi.object({
  bvn: Joi.string().min(11).max(11).required(),
});

const setLoginSchema = Joi.object({
  loginPin: Joi.string().min(6).max(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().lowercase().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().messages({
    'string.base': 'Email should be a type of string',
    'string.empty': 'Email cannot be empty',
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(8).pattern(/[A-Z]/).pattern(/[0-9]/).pattern(/[\W_]/).required().messages({
    'string.base': 'Password should be a type of string',
    'string.empty': 'Password cannot be empty',
    'string.min': 'Password should have at least 8 characters',
    'string.pattern.base': 'Password must include at least one uppercase letter, one number, and one special character',
    'any.required': 'Password is required'
  }),
});

const forgetPassSchema = Joi.object({
  email: Joi.string().lowercase().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().messages({
    'string.base': 'Email should be a type of string',
    'string.empty': 'Email cannot be empty',
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required'
  }),
});

const verifyFgPassOTPSchema = Joi.object({
  resetOTP: Joi.string().min(6).max(6).required(),
});



const analysisSchema = Joi.object({
  goals: Joi.string(),
});

const walletDetails = Joi.object({
  recipientDetails: Joi.string().required(),
});

const amountTrf = Joi.object({
  recipientId:Joi.string().required(),
  amount:Joi.number().required(),
  recipientName:Joi.string().required(),
  remark:Joi.string(),
  budgetId:Joi.string(),
  transactionPin: Joi.number().required(),
});

const initiateCardPaymentSchema = Joi.object({
  amount: Joi.number().required(),
  paymentDescription: Joi.string().required(),
})

const setTransactionSchema = Joi.object({
  transactionPin: Joi.number().required(),
})

const updateTransactionSchema = Joi.object({
  oldPin: Joi.number().required(),
  newPin: Joi.number().required(),
})
const updatePhoneNumber = Joi.object({
  phone: Joi.string()
  .max(10)
  .pattern(/[6-9]{1}[0-9]{9}/)
  .optional(),
});
const updateEmail = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
});
const passwordSchema= Joi.string().min(8).max(25).trim().pattern(/[A-Z]/).pattern(/[0-9]/).pattern(/[\W_]/).required().messages({
  'string.base': 'Password should be a type of string',
  'string.empty': 'Password cannot be empty',
  'string.min': 'Password should have at least 8 characters',
  'string.pattern.base': 'Password must include at least one uppercase letter, one number, and one special character',
  'any.required': 'Password is required'
});
const updatePassword = Joi.object({
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
  confirmPassword: Joi.valid(Joi.ref('newPassword')).required(),
});

const resetPasswordSchema = Joi.object({
 newPassword: passwordSchema,
 confirmPassword: Joi.valid(Joi.ref('newPassword')).required()
});

export {
  validateRequest,
  schemas,
  requiredPhoneSchema,
  otpSchema,
  bvnSchema,
  setLoginSchema,
  residentSchema,
  loginSchema,
  registerSchema,
  businessSchema,
  expenseSchema,
  budgetSchema,
  forgetPassSchema,
  verifyFgPassOTPSchema,
  resetPasswordSchema,
  analysisSchema,
  validateMongoDbId,
  walletDetails,
  amountTrf,
  initiateCardPaymentSchema,
  setTransactionSchema,
  updateTransactionSchema,
  updatePhoneNumber,
  updateEmail,
  updatePassword
};
