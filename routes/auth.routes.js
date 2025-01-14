import express, { json } from 'express';
import { personalSignup,  businessSignup, loginUser, loginBusiness,  resetUserPassword, resetBusinessPassword, forgotUserPassword, forgotBusinessPassword,  uploadPicture, uploadBusinessPicture, deleteUser, verifyUserEmail, verifyBusinessEmail, deleteBusiness} from '../controllers/authControllers.js';
import { validateRequest, registerSchema, businessSchema, expenseSchema, budgetSchema, loginSchema, forgetPassSchema, updatePassword, resetPasswordSchema  } from '../validation/validation.js';
import isAuthenticated from "../middleware/auth.js"
import validatePictureUpload from "../middleware/picValid.js"
import upload from '../public/multer.js';


const router = express.Router(); 

//USER
router.post('/signup', validateRequest(registerSchema),personalSignup );
router.post('/verify-user-email', verifyUserEmail)
router.post('/login-user', validateRequest(loginSchema), loginUser );
router.post('/forgot-user-password', validateRequest(forgetPassSchema), forgotUserPassword );
router.post('/reset-user', resetUserPassword );
router.delete('/delete/:id', deleteUser);
router.post('/picture', isAuthenticated, upload.single("picture"), uploadPicture );
 //Business
router.post('/business', validateRequest(businessSchema), businessSignup);
router.post('/verify-business-email', verifyBusinessEmail)
router.post('/login-business', validateRequest(loginSchema), loginBusiness );
router.post('/reset-business', resetBusinessPassword );
router.post('/forgot-business-password', validateRequest(forgetPassSchema), forgotBusinessPassword );
router.delete('/delete-business/:id', deleteBusiness);
router.post('/business-picture/:id', upload.single("picture"), uploadBusinessPicture );


export default router;