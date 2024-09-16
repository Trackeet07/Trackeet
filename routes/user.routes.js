const express = require('express');
const { personalSignup, bussinessSignup, login, resetPassword, forgotPassword } = require('../controllers/authControllers');

const router = express.Router();

router.post('/personalSignup', personalSignup );
router.post('/bussinessSignup', bussinessSignup );
router.post('/login', login );
router.post('/reset/:token', resetPassword );
router.post('/forgotpassword', forgotPassword );


module.exports = router;