const express = require('express');
const { personalSignup, bussinessSignup, login, resetPassword, forgotPassword, deleteUser, uploadPicture } = require('../controllers/authControllers');
const upload = require("../public/multer");

const router = express.Router();

router.post('/personalSignup', personalSignup );
router.post('/bussinessSignup', bussinessSignup );
router.post('/login', login );
router.post('/reset/:token', resetPassword );
router.post('/forgotpassword', forgotPassword );
router.put('/picture/:id', upload.single("picture"), uploadPicture );
router.delete('/delete', deleteUser);


module.exports = router;