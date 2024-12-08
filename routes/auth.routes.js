import express, { json } from 'express';
//import { personalSignup, protect, businessSignup, loginUser, loginBusiness,   resetUserPassword, resetBusinessPassword, forgotUserPassword, forgotBusinessPassword,  uploadPicture, deleteUser, verifyUserEmail, verifyBusinessEmail } from '../controllers/authControllers.js';
// protect, initiatePayment residentApplication, 
import { personalSignup,  businessSignup, loginUser, loginBusiness,  resetUserPassword, resetBusinessPassword, forgotUserPassword, forgotBusinessPassword,  uploadPicture, deleteUser, verifyUserEmail, verifyBusinessEmail, } from '../controllers/authControllers.js';
import { residentSchema, validateRequest } from '../validation/validation.js';


import upload from '../public/multer.js';


const router = express.Router();  

router.post('/signup', personalSignup );
router.post('/bussiness', businessSignup);
router.post('/verify-user-email', verifyUserEmail)
router.post('/verify-business-email', verifyBusinessEmail)
router.post('/login-user', loginUser );
//router.post("/resident", validateRequest(residentSchema), residentApplication)

//router.post("/residentPayment", initiatePayment )
router.post('/login-business', loginBusiness );
router.post('/reset-user', resetUserPassword );
router.post('/reset-business', resetBusinessPassword );
router.post('/forgot-user-password', forgotUserPassword );
router.post('/forgot-business-password', forgotBusinessPassword );
router.post('/picture/:id', upload.single("picture"), uploadPicture );
router.delete('/delete/:id', deleteUser);


export default router;