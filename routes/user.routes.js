import express, { json } from 'express';
import { personalSignup, login, resetPassword, forgotPassword,  uploadPicture, bussinessSignup, deleteUser, verifyEmail } from '../controllers/authControllers.js';

import upload from '../public/multer.js';


const router = express.Router();

router.post('/personal', personalSignup );
router.post('/bussiness', bussinessSignup);
router.get('/verify-email', verifyEmail)
router.post('/login', login );
router.post('/reset/:token', resetPassword );
router.post('/forgotpassword', forgotPassword );
router.put('/picture/:id', upload.single("picture"), uploadPicture );
router.delete('/delete', deleteUser);


export default router;