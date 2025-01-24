import express, { json } from 'express';
import { personalSignup,  businessSignup, loginUser, loginBusiness,  resetUserPassword, resetBusinessPassword, forgotUserPassword, forgotBusinessPassword,  uploadPicture, uploadBusinessPicture, deleteUser, verifyUserEmail, verifyBusinessEmail, deleteBusiness, setNewUserPassword, setNewBusinessPassword} from '../controllers/authControllers.js';
import { validateRequest, registerSchema, businessSchema, expenseSchema, budgetSchema, loginSchema, forgetPassSchema, updatePassword, resetPasswordSchema,   } from '../validation/validation.js';
import isAuthenticated from "../middleware/auth.js"
import validatePictureUpload from "../middleware/picValid.js"
import upload from '../public/multer.js';
import User from "../models/userModels.js"
import Business from "../models/businessModel.js"

const router = express.Router(); 

//USER
router.post('/signup', validateRequest(registerSchema),personalSignup );
router.post('/verify-user-email', verifyUserEmail)
router.post('/login-user', validateRequest(loginSchema), loginUser );
router.post('/forgot-user-password', validateRequest(forgetPassSchema), forgotUserPassword );
router.post('/reset-user', resetUserPassword );
router.delete('/delete/:id', deleteUser);
router.post('/picture', isAuthenticated(User), upload.single("picture"), uploadPicture );
router.put('/set-new-user-password', isAuthenticated(User), validateRequest(updatePassword), setNewUserPassword);
 

//Business
router.post('/business', validateRequest(businessSchema), businessSignup);
router.post('/verify-business-email', verifyBusinessEmail)
router.post('/login-business', validateRequest(loginSchema), loginBusiness );
router.post('/reset-business', resetBusinessPassword );
router.post('/forgot-business-password', validateRequest(forgetPassSchema), forgotBusinessPassword );
router.delete('/delete-business/:id', deleteBusiness);
router.post('/business-picture/:id', upload.single("picture"), uploadBusinessPicture );
router.put('/set-new-business-password', isAuthenticated(Business), validateRequest(updatePassword), setNewBusinessPassword);

export default router;