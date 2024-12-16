import cloudinary from '../public/cloudinary.js';
import crypto from 'crypto';
import _ from "lodash";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import httpStatus from 'http-status';
import { passwordHash, passwordCompare } from '../middleware/hashing.js';
import jwt from 'jsonwebtoken';
import User from '../models/userModels.js';
import Business from '../models/businessModel.js';
import catchAsync from '../middleware/catchAsync.js';
import { emailService, tokenService } from "../services/index.js";
import { registerSchema, businessSchema, resetPasswordSchema, loginSchema } from '../validation/validation.js';
import winston from 'winston';
import { promisify } from 'util';
const { error } = winston;


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



export const personalSignup = async (req, res, next) => { 
   try{
    let validatedUserData = req.value.body;
      // Check if the email is already registered
      console.log("DAta", validatedUserData)
      const existingUser = await User.findOne({ email: validatedUserData.email });
      if (existingUser) {
         return res.status(httpStatus.BAD_REQUEST).json({
             message: "User already exists"
         })
      }

    const verificationToken = tokenService.generateVerifyEmailToken() // Generate token
    const hashedPassword =  await passwordHash(validatedUserData.password);
    validatedUserData = { ...validatedUserData, password:hashedPassword, confirmEmailToken:verificationToken };

    console.log("Verification Token", verificationToken)

      const newUser = await User.create(validatedUserData);

      //const savedUser = await newUser.save();
      const response = _.omit(savedUser.toObject(), ["password", "passwordResetToken", "resetPasswordToken"])
      
      try {
        const firstName = savedUser.personalName.split(/[, ]+/)[0]
        console.log("FIRST NAME=", firstName)
        //const url = `${req.protocol}://${req.get("host")}/api/user/verifyEmail?email=${savedUser.email}&token=${verificationToken}`
      const url = `http://localhost:3000/verified-email?token=${verificationToken}`
       //const currentDir = path.dirname(new URL(import.meta.url).pathname);
    
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);


        console.log("Filename",__filename);
        console.log("DirName",__dirname);

        // Normalize the path for cross-platform compatibility 
        const templatePath = path.join(__dirname, "../utils/templates/emailVerify.html");

        // Check if the file exists
      if (!fs.existsSync(templatePath)) {
      console.error("File does not exist:", templatePath);
      throw new Error("Template file not found");
      }

      const htmlTemplate = fs.readFileSync(templatePath, "utf8");
      console.log("Template content loaded successfully");
        // // Normalize the path to remove any leading slash and avoid path issues on Windows
        // const normalizedCurrentDir = currentDir.replace(/^\/([A-Za-z])/, '$1');  // Fix leading slash for Windows
        
        // // Debug the computed normalizedCurrentDir to ensure it's correct
        // console.log('Normalized current directory:', normalizedCurrentDir);
        
        // // Resolve the path to 'emailTemplate.html'
        // const templatePath = path.join(normalizedCurrentDir, "../utils/templates/emailVerify.html");
        // console.log("i got here")
        // console.log("i got here>", templatePath)
        // Read the HTML template synchronously
        // const htmlTemplate = fs.readFileSync(templatePath, "utf8");
        // console.log("i broke here", htmlTemplate)
        // if (!savedUser.personalName || !savedUser.email || !url) {
        //    throw new Error('Missing required data for email template');
        //  }
         
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

      return res.status(httpStatus.CREATED).json({ message: `You're almost there! We've sent an email verificaion link to ${savedUser.email}.`, response });
} catch(error) {
  console.log("Error in personalSignup controller:", error);
  return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    message: "Internal server error",
    error: error.message,
  });
   } 
   }

export const verifyUserEmail =async (req, res) => {
try {
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
      // const currentDir = path.dirname(new URL(import.meta.url).pathname);
  
      // // Normalize the path to remove any leading slash and avoid path issues on Windows
      // const normalizedCurrentDir = currentDir.replace(/^\/([A-Za-z])/, '$1');  // Fix leading slash for Windows
      
      // // Debug the computed normalizedCurrentDir to ensure it's correct
      // console.log('Normalized current directory:', normalizedCurrentDir);
      
      // // Resolve the path to 'emailTemplate.html'
      // const templatePath = path.join(normalizedCurrentDir, "../utils/templates/welcome.html");
      
      // // Read the HTML template synchronously
      // const htmlTemplate = fs.readFileSync(templatePath, "utf8");
      // if (!firstName || !savedUser.email || !url) {
      //    throw new Error('Missing required data for email template');
      //  }
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);

         // Normalize the path for cross-platform compatibility 
    const templatePath = path.join(__dirname, "../utils/templates/welcome.html");
    
    // Check if the file exists
if (!fs.existsSync(templatePath)) {
console.log("File does not exist:", templatePath);
throw new Error("Template file not found");
}
const htmlTemplate = fs.readFileSync(templatePath, "utf8");
console.log("Template content loaded successfully");
  

      const emailTemplate = htmlTemplate
     .replace(/{{personalName}}/g, firstName)
     .replace(/{{email}}/g, user.email)
     .replace(/{{url}}/g, url);
  console.log("FirstName", firstName)
      await emailService.sendEmail(emailTemplate, "Welcome", user.email);
      console.log("URL", url)
   }catch (error) {
        // Ensure no further response is sent after failure in the try block
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
              error: error.message,
              message: "Internal server error"
          });
        }
      return res.status(httpStatus.OK).json({ message: `Email Successfully Verified.` });
     
}  catch(error) {
  console.log("Error in personalSignup controller:", error);
  return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    message: "Internal server error",
    error: error.message,
  });
   } 
  }

export const loginUser = catchAsync(async (req, res) => {
    const { email, password } = req.value.body;
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


export const forgotUserPassword = async (req, res) => {
   try{
  const { email } = req.value.body;
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
      const url = `${req.protocol}://${req.get("host")}/api/user/reset-user?token=${resetToken}`;
      //  const currentDir = path.dirname(new URL(import.meta.url).pathname);
   
      //   // Normalize the path to remove any leading slash and avoid path issues on Windows
      //   const normalizedCurrentDir = currentDir.replace(/^\/([A-Za-z])/, '$1');  // Fix leading slash for Windows
        
      //   // Debug the computed normalizedCurrentDir to ensure it's correct
      //   console.log('Normalized current directory:', normalizedCurrentDir);
        
      //   // Resolve the path to 'emailTemplate.html'
      //   const templatePath = path.join(normalizedCurrentDir, "../utils/templates/forgotPassword.html");
        
      //   // Debug the resolved template path
      //   console.log('Resolved template path:', templatePath);
        
      //   // Read the HTML template synchronously
      //   const htmlTemplate = fs.readFileSync(templatePath, "utf8");
      // 
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
  
      // Normalize the path for cross-platform compatibility 
      const templatePath = path.join(__dirname, "../utils/templates/forgotPassword.html");
      
          // Check if the file exists
      if (!fs.existsSync(templatePath)) {
      console.log("File does not exist:", templatePath);
      throw new Error("Template file not found");
      }
      const htmlTemplate = fs.readFileSync(templatePath, "utf8");
      console.log("Template content loaded successfully");

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
  }  catch(error) {
    console.log("Error in personalSignup controller:", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
      error: error.message,
    });
     } 
}


export const resetUserPassword = async (req, res, next) => {
  try {
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
  //  const currentDir = path.dirname(new URL(import.meta.url).pathname);

  //   // Normalize the path to remove any leading slash and avoid path issues on Windows
  //   const normalizedCurrentDir = currentDir.replace(/^\/([A-Za-z])/, '$1');  // Fix leading slash for Windows
    
  //   // Debug the computed normalizedCurrentDir to ensure it's correct
  //   console.log('Normalized current directory:', normalizedCurrentDir);
    
  //   // Resolve the path to 'emailTemplate.html'
  //   const templatePath = path.join(normalizedCurrentDir, "../utils/templates/passwordReset.html");
    
  //   // Debug the resolved template path
  //   console.log('Resolved template path:', templatePath);
    
  //   // Read the HTML template synchronously
  //   const htmlTemplate = fs.readFileSync(templatePath, "utf8");
    
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

     // Normalize the path for cross-platform compatibility 
const templatePath = path.join(__dirname, "../utils/templates/passwordReset.html");

// Check if the file exists
if (!fs.existsSync(templatePath)) {
console.log("File does not exist:", templatePath);
throw new Error("Template file not found");
}
const htmlTemplate = fs.readFileSync(templatePath, "utf8");
console.log("Template content loaded successfully");
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
} catch(error) {
  console.log("Error in personalSignup controller:", error);
  return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    message: "Internal server error",
    error: error.message,
  });
   } 
  }

  export const uploadPicture = catchAsync(async (req, res) => {
  // Ensure Multer is configured correctly
  if (!req.file) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: "No file uploaded" });
  }
    const user = await User.findOne({ _id: req.params.id });

        if (!user) {
            return res.status(httpStatus.BAD_REQUEST).json({ message: "User not found" });
        }

        const result = await cloudinary.v2.uploader.upload(req.file.path);

        const updatedUser = await User.findByIdAndUpdate(
          {
            _id: req.params.id,
          },
            { image: result.secure_url },
            { new: true } 
        );

        return res.status(httpStatus.CREATED).json({
            message: "Picture uploaded successfully",
            data: updatedUser,
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
        const url = `${req.protocol}://${req.get("host")}/api/user/signup`
        
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

       // Normalize the path for cross-platform compatibility 
       const templatePath = path.join(__dirname, "../utils/templates/deleted.html");

       // Check if the file exists
     if (!fs.existsSync(templatePath)) {
     console.error("File does not exist:", templatePath);
     throw new Error("Template file not found");
     }

     const htmlTemplate = fs.readFileSync(templatePath, "utf8");
     console.log("Template content loaded successfully");
       
       // const currentDir = path.dirname(new URL(import.meta.url).pathname);
    
        // // Normalize the path to remove any leading slash and avoid path issues on Windows
        // const normalizedCurrentDir = currentDir.replace(/^\/([A-Za-z])/, '$1');  // Fix leading slash for Windows
        
        // // Debug the computed normalizedCurrentDir to ensure it's correct
        // console.log('Normalized current directory:', normalizedCurrentDir);
        
        // // Resolve the path to 'emailTemplate.html'
        // const templatePath = path.join(normalizedCurrentDir, "../utils/templates/deleted.html");
        
        // // Read the HTML template synchronously
        // const htmlTemplate = fs.readFileSync(templatePath, "utf8");
        // if (!firstName || !deletedUser.email || !url) {
        //    throw new Error('Missing required data for email template');
        //  }
        const emailTemplate = htmlTemplate
        .replace(/{{personalName}}/g, firstName)
        await emailService.sendEmail(emailTemplate, "Account Removed", deletedUser.email);
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

          //BUSINESS AUTH
export const businessSignup = async (req, res) => {
  try {
    let validatedBusinessData = req.value.body;

    const existingBusiness = await Business.findOne({ email: validatedBusinessData.email });
    console.log(existingBusiness);

    if (existingBusiness) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: "Business already exists" });
    }

    const verifyBusinessToken = tokenService.generateVerifyEmailToken() // Generate token
    const hashedPassword =  await passwordHash(validatedBusinessData.password);
    validatedBusinessData = { ...validatedBusinessData, password:hashedPassword, confirmEmailToken:verifyBusinessToken };

    console.log("Verification Token", verifyBusinessToken)
    const newBusiness = await Business.create(validatedBusinessData);
console.log(newBusiness); 

   const savedBusiness = await newBusiness.save();
   const response = _.omit(savedBusiness.toObject(), ["password", "passwordResetToken", "resetPasswordToken"])
   try {
    const firstName = savedBusiness.personalName.split(/[, ]+/)[0]
   //const url = `${req.protocol}://${req.get("host")}/api/user/verify-business-email?email=${savedBusiness.email}&token=${verifyBusinessToken}`
  const url = `http://localhost:3000/verified-business-email?token=${verifyBusinessToken}`
    //const currentDir = path.dirname(new URL(import.meta.url).pathname);

    // // Normalize the path to remove any leading slash and avoid path issues on Windows
    // const normalizedCurrentDir = currentDir.replace(/^\/([A-Za-z])/, '$1');  // Fix leading slash for Windows
    
    // Debug the computed normalizedCurrentDir to ensure it's correct
    //console.log('Normalized current directory:', normalizedCurrentDir);
    
    // Resolve the path to 'emailTemplate.html'
    //const templatePath = path.join(normalizedCurrentDir, "../utils/templates/emailVerify.html");
    
    // Read the HTML template synchronously
    // const htmlTemplate = fs.readFileSync(templatePath, "utf8");
    // if (!savedBusiness.personalName || !savedBusiness.email || !url) {
    //    throw new Error('Missing required data for email template');
    //  }
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Normalize the path for cross-platform compatibility 
    const templatePath = path.join(__dirname, "../utils/templates/emailVerify.html");
    
        // Check if the file exists
    if (!fs.existsSync(templatePath)) {
    console.error("File does not exist:", templatePath);
    throw new Error("Template file not found");
    }
    const htmlTemplate = fs.readFileSync(templatePath, "utf8");
    console.log("Template content loaded successfully");
  

    const emailTemplate = htmlTemplate
   .replace(/{{personalName}}/g, firstName)
   .replace(/{{email}}/g, savedBusiness.email)
   .replace(/{{url}}/g, url);
console.log("FirstName", firstName)
    await emailService.sendEmail(emailTemplate, "Verify Email", savedBusiness.email);
    console.log("URL", url)
}catch(error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
     error: error.message,
     message: "Internal server error"
    })
}

    return res.status(httpStatus.CREATED).json({ message: "Business saved successfully", response});
  } catch(error) {
    console.log("Error in personalSignup controller:", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
      error: error.message,
    });
     } 
    }

export const verifyBusinessEmail =async (req, res) => {
  try {
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
      try {
        const firstName = savedBusiness.personalName.split(/[, ]+/)[0]
        const url = `${req.protocol}://${req.get("host")}/api/user/login-business`
        //const currentDir = path.dirname(new URL(import.meta.url).pathname);
    
        // // Normalize the path to remove any leading slash and avoid path issues on Windows
        // const normalizedCurrentDir = currentDir.replace(/^\/([A-Za-z])/, '$1');  // Fix leading slash for Windows
        
        // // Debug the computed normalizedCurrentDir to ensure it's correct
        // console.log('Normalized current directory:', normalizedCurrentDir);
        
        // // Resolve the path to 'emailTemplate.html'
        // const templatePath = path.join(normalizedCurrentDir, "../utils/templates/welcome.html");
        
        // // Read the HTML template synchronously
        // const htmlTemplate = fs.readFileSync(templatePath, "utf8");
        // if (!business.firstName || !business.email || !url) {
        //    throw new Error('Missing required data for email template');
        //  }
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
  
           // Normalize the path for cross-platform compatibility 
      const templatePath = path.join(__dirname, "../utils/templates/welcome.html");
      
      // Check if the file exists
  if (!fs.existsSync(templatePath)) {
  console.log("File does not exist:", templatePath);
  throw new Error("Template file not found");
  }
  const htmlTemplate = fs.readFileSync(templatePath, "utf8");
  console.log("Template content loaded successfully");

        const emailTemplate = htmlTemplate
       .replace(/{{firstName}}/g, firstName)
       .replace(/{{email}}/g, savedBusiness.email)
       .replace(/{{url}}/g, url);
    console.log("FirstName", firstName)
        await emailService.sendEmail(emailTemplate, "Welcome", business.email);
        console.log("URL", url)
     }catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            error: error.message,
            message: "Internal server error"
           })
     }
     return res.status(httpStatus.OK).json({ message: `Email Successfully Verified.` });
     
    }  catch(error) {
      console.log("Error in personalSignup controller:", error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
        error: error.message,
      });
       } 
      }

export const loginBusiness = catchAsync(async (req, res) => {
        const { email, password } = req.value.body;
        const business = await Business.findOne({ email }).select('+password');;
      
        if(!business ||!(await passwordCompare(password, business.password))) {
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
      

export const forgotBusinessPassword = async (req, res) => {
try {    
       const { email } = req.value.body;
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

         //res.status(httpStatus.OK).json({ message: `Email Sent.` });
        
         try {
          const firstName = business.personalName.split(/[, ]+/)[0]
          const url = `${req.protocol}://${req.get("host")}/api/user/reset-business?token=${businessResetToken}`;
          //  const currentDir = path.dirname(new URL(import.meta.url).pathname);
       
          //   // Normalize the path to remove any leading slash and avoid path issues on Windows
          //   const normalizedCurrentDir = currentDir.replace(/^\/([A-Za-z])/, '$1');  // Fix leading slash for Windows
            
          //   // Debug the computed normalizedCurrentDir to ensure it's correct
          //   console.log('Normalized current directory:', normalizedCurrentDir);
            
          //   // Resolve the path to 'emailTemplate.html'
          //   const templatePath = path.join(normalizedCurrentDir, "../../../utils/templates/forgotPassword.html");
            
          //   // Debug the resolved template path
          //   console.log('Resolved template path:', templatePath);
            
          //   // Read the HTML template synchronously
          //   const htmlTemplate = fs.readFileSync(templatePath, "utf8");
          //  
          const __filename = fileURLToPath(import.meta.url);
          const __dirname = path.dirname(__filename);
      
          // Normalize the path for cross-platform compatibility 
          const templatePath = path.join(__dirname, "../utils/templates/forgotPassword.html");
          
              // Check if the file exists
          if (!fs.existsSync(templatePath)) {
          console.log("File does not exist:", templatePath);
          throw new Error("Template file not found");
          }
          const htmlTemplate = fs.readFileSync(templatePath, "utf8");
          console.log("Template content loaded successfully");

           const emailTemplate = htmlTemplate
           .replace(/{{firstName}}/g, firstName)
           .replace(/{{email}}/g, business.email)  
           .replace(/{{url}}/g, url)
       
         await emailService.sendEmail(emailTemplate, "Reset Password", business.email);
           console.log("URL", url)
         return res.status(httpStatus.OK).json({
           success: true,
           business,
           message: "Password reset link sent Successfully"
         })
       }catch(err) {
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
           err: err.message,
           message: "Internal server error"
          });
       }
       
      }  catch(error) {
        console.log("Error in personalSignup controller:", error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
          message: "Internal server error",
          error: error.message,
        });
         } 
    }

    export const resetBusinessPassword = async (req, res, next) => {
     try {
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
      const business = await Business.findOne({ 
      passwordResetToken: token,
     
       })
      console.log("QUERIED USER", business)
      if(!business) {
          return res.status(httpStatus.BAD_REQUEST).json({
              message: 'business not found signup and verify'})
      }
         // Check if the reset token has expired
         if (business.passwordResetExpires && new Date(business.passwordResetExpires) < new Date()) {
          return res.status(httpStatus.BAD_REQUEST).json({
              message: 'The password reset token has expired. Please request a new one.'
          });
      }
    
      const hashedPassword = await passwordHash(req.body.newPassword)
    
      business.password = hashedPassword;
      business.passwordResetToken = undefined;
      business.passwordResetExpires = undefined;
      await business.save()
     try {
      const firstName = business.personalName.split(/[, ]+/)[0]
      const url = `${req.protocol}://${req.get("host")}/api/user/login`;
      //  const currentDir = path.dirname(new URL(import.meta.url).pathname);
    
      //   // Normalize the path to remove any leading slash and avoid path issues on Windows
      //   const normalizedCurrentDir = currentDir.replace(/^\/([A-Za-z])/, '$1');  // Fix leading slash for Windows
        
      //   // Debug the computed normalizedCurrentDir to ensure it's correct
      //   console.log('Normalized current directory:', normalizedCurrentDir);
        
      //   // Resolve the path to 'emailTemplate.html'
      //   const templatePath = path.join(normalizedCurrentDir, "../../../utils/templates/passwordChanged.html");
        
      //   // Debug the resolved template path
      //   console.log('Resolved template path:', templatePath);
        
      //   // Read the HTML template synchronously
      //   const htmlTemplate = fs.readFileSync(templatePath, "utf8");
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);

         // Normalize the path for cross-platform compatibility 
    const templatePath = path.join(__dirname, "../utils/templates/passwordReset.html");
    
    // Check if the file exists
if (!fs.existsSync(templatePath)) {
console.log("File does not exist:", templatePath);
throw new Error("Template file not found");
}
const htmlTemplate = fs.readFileSync(templatePath, "utf8");
console.log("Template content loaded successfully");
        const emailTemplate = htmlTemplate
       .replace(/{{firstName}}/g, firstName)
       .replace(/{{email}}/g, business.email)  
       .replace(/{{url}}/g, url)
    
     await emailService.sendEmail(emailTemplate, "Password Changed Succesfully", business.email);
     return res.status(httpStatus.OK).json({
       success: true,
       business,
       message: "Password reset link sent Successfully"
     })
    }catch(err) {
      console.log("ERROR", err)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        
       err: err.message,
       message: "Internal server error"
      })
    }
  } catch(error) {
      console.log("Error in personalSignup controller:", error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
        error: error.message,
      });
       } 
      }

      export const uploadBusinessPicture = catchAsync(async (req, res) => {
        // Ensure Multer is configured correctly
        if (!req.file) {
          return res.status(httpStatus.BAD_REQUEST).json({ message: "No file uploaded" });
        }
          const business = await Business.findOne({ _id: req.params.id });
      
              if (!business) {
                  return res.status(httpStatus.BAD_REQUEST).json({ message: "User not found" });
              }
      
              const result = await cloudinary.v2.uploader.upload(req.file.path);
      
              const updatedBusiness = await Business.findByIdAndUpdate(
                {
                  _id: req.params.id,
                },
                  { image: result.secure_url },
                  { new: true } 
              );
      
              return res.status(httpStatus.CREATED).json({
                  message: "Picture uploaded successfully",
                  data: updatedBusiness,
              });
      });

      export const deleteBusiness = catchAsync (async (req, res) => {
        const businessId = req.params.id
    console.log("HRTR")
        const deletedBusiness = await Business.findByIdAndDelete(businessId)
  
        console.log("DELETED:", deletedBusiness)
        if (!deletedBusiness) {
          return res.status(httpStatus.NOT_FOUND).json({ message: "Business not found" });
        };
        
        //await cloudinary.uploader.destroy(deletedUser.image); // Delete the image from cloudinary
  
        // await sendAccountDeletedEmail(email, personalName);
        try {
          const firstName = deletedBusiness.personalName.split(/[, ]+/)[0]
          const url = `${req.protocol}://${req.get("host")}/api/user/business`
          
          const __filename = fileURLToPath(import.meta.url);
          const __dirname = path.dirname(__filename);
  
         // Normalize the path for cross-platform compatibility 
         const templatePath = path.join(__dirname, "../utils/templates/deleted.html");
  
         // Check if the file exists
       if (!fs.existsSync(templatePath)) {
       console.error("File does not exist:", templatePath);
       throw new Error("Template file not found");
       }
  
       const htmlTemplate = fs.readFileSync(templatePath, "utf8");
       console.log("Template content loaded successfully");
         
         // const currentDir = path.dirname(new URL(import.meta.url).pathname);
      
          // // Normalize the path to remove any leading slash and avoid path issues on Windows
          // const normalizedCurrentDir = currentDir.replace(/^\/([A-Za-z])/, '$1');  // Fix leading slash for Windows
          
          // // Debug the computed normalizedCurrentDir to ensure it's correct
          // console.log('Normalized current directory:', normalizedCurrentDir);
          
          // // Resolve the path to 'emailTemplate.html'
          // const templatePath = path.join(normalizedCurrentDir, "../utils/templates/deleted.html");
          
          // // Read the HTML template synchronously
          // const htmlTemplate = fs.readFileSync(templatePath, "utf8");
          // if (!firstName || !deletedBusiness.email || !url) {
          //    throw new Error('Missing required data for email template');
          //  }
          const emailTemplate = htmlTemplate
          .replace(/{{personalName}}/g, firstName)
          await emailService.sendEmail(emailTemplate, "Welcome", deletedBusiness.email);
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
          message: "Business Deleted Successfully",
          deletedBusiness,
        });
    });
  
    