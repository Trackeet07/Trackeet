import cloudinary from '../public/cloudinary.js';
import crypto from 'crypto';
import path from "path";
import fs from "fs";
import httpStatus from 'http-status';
import { passwordHash, passwordCompare } from '../middleware/hashing.js';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/userModels.js';
import Business from '../models/userModels.js';
import catchAsync from '../middleware/catchAsync.js';
//import { sendVerificationEmail } from "../utils/email/email-sender.js"
import { emailService, tokenService } from "../services/index.js";
//import Resident from '../models/resident.js';
import { registerSchema, businessSchema, resetPasswordSchema, loginSchema } from '../validation/validation.js';
import winston from 'winston';
import { promisify } from 'util';
const { error } = winston;

//import { initiateTransfer } from "../utils/transferService.js"

//const r//ave = new Flutterwave(process.env.FLUTTERWAVE_PUBLIC_KEY, process.env.FLUTTERWAVE_SECRET_KEY);



const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h"   // 24 hours
  })
}

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id)
res.status(statusCode).json({
     status: "success",
     token,
     data: {
         user
      
      }
  })
}


export const residentApplication = catchAsync( async(req, res) => {
  const validatedData = req.value.body;
const newResident = await Resident.create(validatedData)

const savedResident = await newResident.save();

try {
  const firstName = savedResident.fullName.split(/[, ]+/)[0]
  console.log("FIRST NAME=", firstName)
  const currentDir = path.dirname(new URL(import.meta.url).pathname);

  // Normalize the path to remove any leading slash and avoid path issues on Windows
  const normalizedCurrentDir = currentDir.replace(/^\/([A-Za-z])/, '$1');  // Fix leading slash for Windows
  
  // Debug the computed normalizedCurrentDir to ensure it's correct
  console.log('Normalized current directory:', normalizedCurrentDir);
  
  // Resolve the path to 'emailTemplate.html'
  const templatePath = path.join(normalizedCurrentDir, "../utils/templates/resident.html");
  
  // Read the HTML template synchronously
  const htmlTemplate = fs.readFileSync(templatePath, "utf8");
  if (!savedResident.fullName || !savedResident.email) {
     throw new Error('Missing required data for email template');
   }
   console.log("OLA>>")
  const emailTemplate = htmlTemplate
 .replace(/{{personalName}}/g, firstName)
 .replace(/{{email}}/g, savedResident.email)
  await emailService.sendEmail(emailTemplate, "Your Grazac Talent City Residency Application is Under Review", savedResident.email);
}catch(error) {
  return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
   error: error.message,
   message: "Internal server error"
  })
}
return res.status(httpStatus.CREATED).json({ message: `Successful` });
})

// export const initiatePayment = async (req, res) => {
//   const { email, amount, currency, tx_ref } = req.body;

//   try {
//     const payload = {
//       reference: `trans-${Date.now()}`,
//       amount: 100000,
//       currency: "NGN",
//       //redirect_url: "https://your-domain.com/payment-callback",
//       customer: {
//         email,
//       },
//       customizations: {
//         title: "GRAZAC TALENT CITY",
//         description: "Payment for Resident",
//         logo: "https://your-domain.com/logo.png",
//       },
//     };
//     console.log("Flutter",flw.Payment); // Check if `initialize` is available

//     const response = await flw.Payment.initialize(payload);
//     if (response.status === "success") {
//       return res.status(200).json({
//         message: "Payment initiated successfully",
//         data: response,
//       });
//     } else {
//       throw new Error(response.message);
//     }
//   } catch (error) {
//     console.error("Payment initiation error:", error);
//     res.status(500).json({ error: error.message });
//   }
// };


// export const initiatePayment = catchAsync (async (req, res) => {
  
//   const { account_bank, account_number, amount, narration } = req.body;
//   try {
//     const response = await initiateTransfer({ account_bank, account_number,  amount, narration });//
//     res.status(200).json({
//       message: "Transfer initiated successfully",
//       data: response,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error initiating transfer",
//       error: error.message,
//     });
//   }
// })

// export const verifyPayment = async (req, res) => {
//   const { transaction_id } = req.query;

//   try {
//     const response = await flw.Transaction.verify({ id: transaction_id });

//     if (response.status === "success") {
//       return res.status(200).json({
//         message: "Payment verified successfully",
//         data: response,
//       });
//     } else {
//       throw new Error("Payment verification failed");
//     }
//   } catch (error) {
//     console.error("Payment verification error:", error);
//     res.status(500).json({ error: error.message });
//   }
// };
















export const personalSignup = async (req, res, next) => { 
   try{
    const { error, value } = registerSchema.validate(req.body, {abortEarly: false})

      if(error) {
        console.log("Errors", error)
        return res.status(httpStatus.NOT_FOUND).json({
            message: error.message
        })
    }
      
    console.log("Value", value)
      // Check if the email is already registered
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
         return res.status(httpStatus.BAD_REQUEST).json({
             message: "User already exists"
         })
      }

    const verificationToken = tokenService.generateVerifyEmailToken() // Generate token
    const hashedPassword =  await passwordHash(req.body.password);
    req.body = { ...req.body, password:hashedPassword, confirmEmailToken:verificationToken };

    console.log("Verification Token", verificationToken)

      const newUser = await User.create(req.body);

      const savedUser = await newUser.save();
      
      try {
        const firstName = savedUser.personalName.split(/[, ]+/)[0]
        console.log("FIRST NAME=", firstName)
        const url = `${req.protocol}://${req.get("host")}/api/user/verifyEmail?email=${savedUser.email}&token=${verificationToken}`
        const currentDir = path.dirname(new URL(import.meta.url).pathname);
    
        // Normalize the path to remove any leading slash and avoid path issues on Windows
        const normalizedCurrentDir = currentDir.replace(/^\/([A-Za-z])/, '$1');  // Fix leading slash for Windows
        
        // Debug the computed normalizedCurrentDir to ensure it's correct
        console.log('Normalized current directory:', normalizedCurrentDir);
        
        // Resolve the path to 'emailTemplate.html'
        const templatePath = path.join(normalizedCurrentDir, "../utils/templates/emailVerify.html");
        console.log("i got here")
        console.log("i got here>", templatePath)
        // Read the HTML template synchronously
        const htmlTemplate = fs.readFileSync(templatePath, "utf8");
        console.log("i broke here", htmlTemplate)
        if (!savedUser.personalName || !savedUser.email || !url) {
           throw new Error('Missing required data for email template');
         }
         console.log("stopped g here")
        const emailTemplate = htmlTemplate
       .replace(/{{personalName}}/g, firstName)
       .replace(/{{email}}/g, savedUser.email)
       .replace(/{{url}}/g, url);
    console.log("FirstName", savedUser.personalName)
        await emailService.sendEmail(emailTemplate, "Verify Email", savedUser.email);
        console.log("URL", url)
    }catch(error) {
      console.log("Error in sendEmail:", error); 
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
         error: error.message,
         message: "Internal server error"
        })
    }

      return res.status(httpStatus.CREATED).json({ message: `You're almost there! We've sent an email verificaion link to ${savedUser.email}.` });
} catch(error) {
  console.log("Error in personalSignup controller:", error);
  return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    message: "Internal server error",
    error: error.message,
  });
   } 
   }

      

export const businessSignup = catchAsync(async (req, res) => {
  const { error, value } = businessSchema.validate(req.body, {abortEarly: false})

        if (error) {
          console.log("Errors", error)
          return res.status(httpStatus.BAD_REQUEST).json({ message: "Please provide all required fields" });
        }

        const existingBusiness = await Business.findOne({ email: req.body.email });
        console.log(existingBusiness);

        if (existingBusiness) {
            return res.status(httpStatus.CONFLICT).json({ message: "Business already exists" });
        }

        const verifyBusinessToken = tokenService.generateVerifyEmailToken() // Generate token
        const hashedPassword =  await passwordHash(req.body.password);
        req.body = { ...req.body, password:hashedPassword, confirmEmailToken:verifyBusinessToken };
    
        console.log("Verification Token", verifyBusinessToken)
        const newBusiness = await Business.create(req.body);
    console.log(newBusiness); 
  
       const savedBusiness = await newBusiness.save();
       try {
        const url = `${req.protocol}://${req.get("host")}/api/user/verifyEmail?email=${savedBusiness.email}&token=${verifyBusinessToken}`
        const currentDir = path.dirname(new URL(import.meta.url).pathname);
    
        // Normalize the path to remove any leading slash and avoid path issues on Windows
        const normalizedCurrentDir = currentDir.replace(/^\/([A-Za-z])/, '$1');  // Fix leading slash for Windows
        
        // Debug the computed normalizedCurrentDir to ensure it's correct
        console.log('Normalized current directory:', normalizedCurrentDir);
        
        // Resolve the path to 'emailTemplate.html'
        const templatePath = path.join(normalizedCurrentDir, "../utils/templates/emailVerify.html");
        
        // Read the HTML template synchronously
        const htmlTemplate = fs.readFileSync(templatePath, "utf8");
        if (!savedBusiness.personalName || !savedBusiness.email || !url) {
           throw new Error('Missing required data for email template');
         }
        const emailTemplate = htmlTemplate
       .replace(/{{personalName}}/g, savedBusiness.personalName)
       .replace(/{{email}}/g, savedBusiness.email)
       .replace(/{{url}}/g, url);
    console.log("FirstName", savedBusiness.personalName)
        await emailService.sendEmail(emailTemplate, "Verify Email", savedBusiness.email);
        console.log("URL", url)
    }catch(error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
         error: error.message,
         message: "Internal server error"
        })
    }

        return res.status(httpStatus.CREATED).json({ message: "Business saved successfully", newBusiness });
});

export const forgotUserPassword = catchAsync( async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: "Please input your email" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
    }

    const resetToken = tokenService.generateVerifyEmailToken(); 
    const expirationTime = new Date();
     expirationTime.setMinutes(expirationTime.getMinutes() + 5);
 
     user.passwordResetToken = resetToken;
     user.passwordResetTokenExpires = expirationTime;
     await user.save();
    
     try {
      const firstName = user.personalName.split(/[, ]+/)[0]
      const url = `${req.protocol}://${req.get("host")}/api/user/resetPassword?token=${resetToken}`;
       const currentDir = path.dirname(new URL(import.meta.url).pathname);
   
        // Normalize the path to remove any leading slash and avoid path issues on Windows
        const normalizedCurrentDir = currentDir.replace(/^\/([A-Za-z])/, '$1');  // Fix leading slash for Windows
        
        // Debug the computed normalizedCurrentDir to ensure it's correct
        console.log('Normalized current directory:', normalizedCurrentDir);
        
        // Resolve the path to 'emailTemplate.html'
        const templatePath = path.join(normalizedCurrentDir, "../utils/templates/forgotPassword.html");
        
        // Debug the resolved template path
        console.log('Resolved template path:', templatePath);
        
        // Read the HTML template synchronously
        const htmlTemplate = fs.readFileSync(templatePath, "utf8");
        const emailTemplate = htmlTemplate
       .replace(/{{personalName}}/g, firstName)
       .replace(/{{email}}/g, user.email)  
       .replace(/{{url}}/g, url)
   
     await emailService.sendEmail(emailTemplate, "Reset Password", user.email);
       console.log("URL", url)
     return res.status(httpStatus.OK).json({
       success: true,
       user,
       message: "Password reset link sent Successfully"
     })
   }catch(err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
       err: err.message,
       message: "Internal server error"
      })
   }
});

export const forgotBusinessPassword = catchAsync( async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: "Please input your email" });
  }

  const business = await Business.findOne({ email });
  if (!business) {
    return res.status(httpStatus.NOT_FOUND).json({ message: "Business not found" });
  }

  const businessResetToken = tokenService.generateVerifyEmailToken(); 
  const expirationTime = new Date();
   expirationTime.setMinutes(expirationTime.getMinutes() + 5);

   business.passwordResetToken = businessResetToken;
   business.passwordResetTokenExpires = expirationTime;
   await business.save();
  
   try {
    const url = `${req.protocol}://${req.get("host")}/api/user/resetPassword?token=${resetToken}`;
     const currentDir = path.dirname(new URL(import.meta.url).pathname);
 
      // Normalize the path to remove any leading slash and avoid path issues on Windows
      const normalizedCurrentDir = currentDir.replace(/^\/([A-Za-z])/, '$1');  // Fix leading slash for Windows
      
      // Debug the computed normalizedCurrentDir to ensure it's correct
      console.log('Normalized current directory:', normalizedCurrentDir);
      
      // Resolve the path to 'emailTemplate.html'
      const templatePath = path.join(normalizedCurrentDir, "../../../utils/templates/forgotPassword.html");
      
      // Debug the resolved template path
      console.log('Resolved template path:', templatePath);
      
      // Read the HTML template synchronously
      const htmlTemplate = fs.readFileSync(templatePath, "utf8");
      const emailTemplate = htmlTemplate
     .replace(/{{firstName}}/g, business.personalName)
     .replace(/{{email}}/g, business.email)  
     .replace(/{{url}}/g, url)
 
   await emailService.sendEmail(emailTemplate, "Reset Password", business.email);
     console.log("URL", url)
   return res.status(httpStatus.OK).json({
     success: true,
     user,
     message: "Password reset link sent Successfully"
   })
 }catch(err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
     err: err.message,
     message: "Internal server error"
    })
 }
});

export const resetUserPassword = catchAsync(async (req, res, next) => {
  const { token } = req.query;
  const { error, value } = resetPasswordSchema.validate(req.body, {abortEarly:false})
  if(!token) {
      return res.status(httpStatus.NOT_FOUND).json({
          message: "Please insert a valid URL"
      })
  }
  if(error) {
      console.log("Errors", error)
      return res.status(httpStatus.BAD_REQUEST).json({
          message: error.message
      })
  }
  const user = await User.findOne({ 
  passwordResetToken: token,
 
   })
  console.log("QUERIED USER", user)
  if(!user) {
      return res.status(httpStatus.BAD_REQUEST).json({
          message: 'User not found signup and verify'})
  }
     // Check if the reset token has expired
     if (user.passwordResetExpires && new Date(user.passwordResetExpires) < new Date()) {
      return res.status(httpStatus.BAD_REQUEST).json({
          message: 'The password reset token has expired. Please request a new one.'
      });
  }

  const hashedPassword = await passwordHash(req.body.newPassword)

  user.password = hashedPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  const savedUser = await user.save()
 try {
  const firstName = savedUser.personalName.split(/[, ]+/)[0]
  const url = `${req.protocol}://${req.get("host")}/api/user/login`;
   const currentDir = path.dirname(new URL(import.meta.url).pathname);

    // Normalize the path to remove any leading slash and avoid path issues on Windows
    const normalizedCurrentDir = currentDir.replace(/^\/([A-Za-z])/, '$1');  // Fix leading slash for Windows
    
    // Debug the computed normalizedCurrentDir to ensure it's correct
    console.log('Normalized current directory:', normalizedCurrentDir);
    
    // Resolve the path to 'emailTemplate.html'
    const templatePath = path.join(normalizedCurrentDir, "../utils/templates/passwordReset.html");
    
    // Debug the resolved template path
    console.log('Resolved template path:', templatePath);
    
    // Read the HTML template synchronously
    const htmlTemplate = fs.readFileSync(templatePath, "utf8");
    const emailTemplate = htmlTemplate
   .replace(/{{personalName}}/g, firstName)
   .replace(/{{email}}/g, user.email)  
   .replace(/{{url}}/g, url)

 await emailService.sendEmail(emailTemplate, "Password Changed Succesfully", user.email);
 return res.status(httpStatus.OK).json({
   success: true,
   user,
   message: "Password reset link sent Successfully"
 })
}catch(err) {
  return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
   err: err.message,
   message: "Internal server error"
  })
}
});


export const resetBusinessPassword = catchAsync(async (req, res, next) => {
  const { token } = req.query;
  const { error, value } = resetPasswordSchema.validate(req.body, {abortEarly:false})
  if(!token) {
      return res.status(httpStatus.NOT_FOUND).json({
          message: "Please insert a valid URL"
      })
  }
  if(error) {
      console.log("Errors", error)
      return res.status(httpStatus.BAD_REQUEST).json({
          message: error.message
      })
  }
  const user = await User.findOne({ 
  passwordResetToken: token,
 
   })
  console.log("QUERIED USER", user)
  if(!user) {
      return res.status(httpStatus.BAD_REQUEST).json({
          message: 'User not found signup and verify'})
  }
     // Check if the reset token has expired
     if (user.passwordResetExpires && new Date(user.passwordResetExpires) < new Date()) {
      return res.status(httpStatus.BAD_REQUEST).json({
          message: 'The password reset token has expired. Please request a new one.'
      });
  }

  const hashedPassword = await passwordHash(req.body.newPassword)

  user.password = hashedPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save()
 try {
  const url = `${req.protocol}://${req.get("host")}/api/user/login`;
   const currentDir = path.dirname(new URL(import.meta.url).pathname);

    // Normalize the path to remove any leading slash and avoid path issues on Windows
    const normalizedCurrentDir = currentDir.replace(/^\/([A-Za-z])/, '$1');  // Fix leading slash for Windows
    
    // Debug the computed normalizedCurrentDir to ensure it's correct
    console.log('Normalized current directory:', normalizedCurrentDir);
    
    // Resolve the path to 'emailTemplate.html'
    const templatePath = path.join(normalizedCurrentDir, "../../../utils/templates/passwordChanged.html");
    
    // Debug the resolved template path
    console.log('Resolved template path:', templatePath);
    
    // Read the HTML template synchronously
    const htmlTemplate = fs.readFileSync(templatePath, "utf8");
    const emailTemplate = htmlTemplate
   .replace(/{{firstName}}/g, user.firstName)
   .replace(/{{email}}/g, user.email)  
   .replace(/{{url}}/g, url)

 await emailService.sendEmail(emailTemplate, "Password Changed Succesfully", user.email);
 return res.status(httpStatus.OK).json({
   success: true,
   user,
   message: "Password reset link sent Successfully"
 })
}catch(err) {
  return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
   err: err.message,
   message: "Internal server error"
  })
}
});

  

  export const uploadPicture = catchAsync(async (req, res) => {
        const user = await User.findOne({ _id: req.params.id });

        if (!user) {
            return res.status(httpStatus.BAD_REQUEST).json({ message: "User not found" });
        }

        const result = await cloudinary.v2.uploader.upload(req.file.path);

        const updateUser = await User.findByIdAndUpdate(
          {
            _id: req.params.id,
          },
            { image: result.secure_url },
            { new: true } 
        );

        return res.status(httpStatus.CREATED).json({
            message: "Picture uploaded successfully",
            data: updateUser,
        });
});


  export const deleteUser = catchAsync (async (req, res) => {
      const userId = req.params.id
  console.log("HRTR")
      const deletedUser = await User.findByIdAndDelete(userId)

      console.log("DELETED:", deletedUser)
      if (!deletedUser) {
        return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
      };
      
      //await cloudinary.uploader.destroy(deletedUser.image); // Delete the image from cloudinary

      // await sendAccountDeletedEmail(email, personalName);
      try {
        const firstName = deletedUser.personalName.split(/[, ]+/)[0]
        const url = `${req.protocol}://${req.get("host")}/api/user/login`
        const currentDir = path.dirname(new URL(import.meta.url).pathname);
    
        // Normalize the path to remove any leading slash and avoid path issues on Windows
        const normalizedCurrentDir = currentDir.replace(/^\/([A-Za-z])/, '$1');  // Fix leading slash for Windows
        
        // Debug the computed normalizedCurrentDir to ensure it's correct
        console.log('Normalized current directory:', normalizedCurrentDir);
        
        // Resolve the path to 'emailTemplate.html'
        const templatePath = path.join(normalizedCurrentDir, "../utils/templates/deleted.html");
        
        // Read the HTML template synchronously
        const htmlTemplate = fs.readFileSync(templatePath, "utf8");
        if (!firstName || !deletedUser.email || !url) {
           throw new Error('Missing required data for email template');
         }
        const emailTemplate = htmlTemplate
        .replace(/{{personalName}}/g, firstName)
        await emailService.sendEmail(emailTemplate, "Welcome", deletedUser.email);
        console.log("URL", url)
     }catch (error) {
          // Ensure no further response is sent after failure in the try block
          if (!res.headersSent) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                error: error.message,
                message: "Internal server error"
            });
        }}
      res.status(httpStatus.OK).json({
        message: "User Deleted Successfully",
        deletedUser,
      });
  });

  export const verifyUserEmail =catchAsync(async (req, res) => {

        const { email, token } = req.query;
        console.log("Token", token)
        if(!(token && email)) {
        return res.status(httpStatus.BAD_REQUEST).json({
            message: "Please insert a valid URL"
        })
      }
        const user = await User.findOne({ email });
        console.log("QUERIED USER", user)
        if(!user) {
          return res.status(httpStatus.BAD_REQUEST).json({ 
              message: 'User not found signup and verify'})
      }
      if(user.isVerified === true) {
        // return next(new AppError('User already verified you can Login now', 400))
        return res.status(httpStatus.FORBIDDEN).json({
            message: 'user already veriffied you can Login now'
        })
    }
    if(+token !== user.confirmEmailToken) {
      console.log("Token Type:", typeof token);
      console.log("Expected Token Type:", typeof user.confirmEmailToken);

      console.log("COMPARE", token)
      console.log("COMPARES", user.confirmEmailToken)
      return res.status(httpStatus.FORBIDDEN).json({
          message: 'You have entered a wrong token'
      })
  }
        user.isVerified = true;
        user.confirmEmailToken = undefined; // Clear the token after verification
        const savedUser = await user.save();
        try {
          const firstName = savedUser.personalName.split(/[, ]+/)[0]
          const url = `${req.protocol}://${req.get("host")}/api/user/login`
          const currentDir = path.dirname(new URL(import.meta.url).pathname);
      
          // Normalize the path to remove any leading slash and avoid path issues on Windows
          const normalizedCurrentDir = currentDir.replace(/^\/([A-Za-z])/, '$1');  // Fix leading slash for Windows
          
          // Debug the computed normalizedCurrentDir to ensure it's correct
          console.log('Normalized current directory:', normalizedCurrentDir);
          
          // Resolve the path to 'emailTemplate.html'
          const templatePath = path.join(normalizedCurrentDir, "../utils/templates/welcome.html");
          
          // Read the HTML template synchronously
          const htmlTemplate = fs.readFileSync(templatePath, "utf8");
          if (!firstName || !savedUser.email || !url) {
             throw new Error('Missing required data for email template');
           }
          const emailTemplate = htmlTemplate
         .replace(/{{personalName}}/g, firstName)
         .replace(/{{email}}/g, user.email)
         .replace(/{{url}}/g, url);
      console.log("FirstName", user.firstName)
          await emailService.sendEmail(emailTemplate, "Welcome", user.email);
          console.log("URL", url)
       }catch (error) {
            // Ensure no further response is sent after failure in the try block
            if (!res.headersSent) {
              return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                  error: error.message,
                  message: "Internal server error"
              });
          }}
          return res.status(httpStatus.OK).json({ message: `Email Successfully Verified.` });
         
});

export const verifyBusinessEmail =catchAsync(async (req, res) => {
  const { email, token } = req.query;
  console.log("Token", token)
  if(!(token && email)) {
  return res.status(httpStatus.BAD_REQUEST).json({
      message: "Please insert a valid URL"
  })
}
  const business = await Business.findOne({ email });
  console.log("QUERIED Business", business)
  if(!business) {
    return res.status(httpStatus.BAD_REQUEST).json({
        message: 'User not found signup and verify'})
}
if(business.isVerified === true) {
  // return next(new AppError('business already verified you can Login now', 400))
  return res.status(httpStatus.FORBIDDEN).json({
      message: 'business already veriffied you can Login now'
  })
}
if(+token !== business.confirmEmailToken) {
console.log("Token Type:", typeof token);
console.log("Expected Token Type:", typeof business.confirmEmailToken);

console.log("COMPARE", token)
console.log("COMPARES", business.confirmEmailToken)
return res.status(httpStatus.FORBIDDEN).json({
    message: 'You have entered a wrong token'
})
}
  business.isVerified = true;
  business.confirmEmailToken = undefined; // Clear the token after verification
  const savedBusiness = await business.save();

  createSendToken(savedBusiness, 200, res);
  try {
    const url = `${req.protocol}://${req.get("host")}/api/user/login`
    const currentDir = path.dirname(new URL(import.meta.url).pathname);

    // Normalize the path to remove any leading slash and avoid path issues on Windows
    const normalizedCurrentDir = currentDir.replace(/^\/([A-Za-z])/, '$1');  // Fix leading slash for Windows
    
    // Debug the computed normalizedCurrentDir to ensure it's correct
    console.log('Normalized current directory:', normalizedCurrentDir);
    
    // Resolve the path to 'emailTemplate.html'
    const templatePath = path.join(normalizedCurrentDir, "../utils/templates/welcome.html");
    
    // Read the HTML template synchronously
    const htmlTemplate = fs.readFileSync(templatePath, "utf8");
    if (!business.firstName || !business.email || !url) {
       throw new Error('Missing required data for email template');
     }
    const emailTemplate = htmlTemplate
   .replace(/{{firstName}}/g, business.personalName)
   .replace(/{{email}}/g, business.email)
   .replace(/{{url}}/g, url);
console.log("FirstName", business.personalName)
    await emailService.sendEmail(emailTemplate, "Welcome", business.email);
    console.log("URL", url)
 }catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        error: error.message,
        message: "Internal server error"
       })
 }
   
});




// authController.js
export const loginUser = catchAsync(async (req, res) => {
      const { email, password } = req.body;
      if(!email || !password) {
        return res.status(httpStatus.UNAUTHORIZED).json({
          message: "Please provide email and password"});
    }
      const user = await User.findOne({ email }).select('+password');;

      if(!user ||!(await passwordCompare(password, user.password))) {
        return res.status(httpStatus.UNAUTHORIZED).json({
            message:"Invalid email or password"
        
    });
    }
    if(!user.isVerified === true ) {
      return res.status(httpStatus.UNAUTHORIZED).json({
          message:"User not verified yet***",
  })
}
  createSendToken(user, 200, res)
});

// authController.js
export const loginBusiness = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  if(!email || !password) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      message: "Please provide email and password"});
}
  const business = await Business.findOne({ email }).select('+password');;

  if(!busniess ||!(await passwordCompare(password, business.password))) {
    return res.status(httpStatus.UNAUTHORIZED).json({
        message:"Invalid email or password"
    
});
}
if(!business.isVerified === true ) {
  return res.status(httpStatus.UNAUTHORIZED).json({
      message:"User not verified yet***",
})
}
createSendToken(business, 200, res)
});



export const protect = catchAsync( async(req, res, next) => {
  let token;
  if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]
  }
  if(!token) {
    return res.status(httpStatus.UNAUTHORIZED).json({message: "You are not logged in! Please log in to get Access."})
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

  const currentUser = await User.findById(decoded.id);
  if(!currentUser) {
    return res.status(httpStatus.UNAUTHORIZED).json({ message: "User no longer exist"})
  }
  req.user = currentUser 
  next()

}
)