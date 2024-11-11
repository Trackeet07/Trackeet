
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// mailer.js

// Helper function to get the correct name
const getName = (personalName, businessName) => {
    return personalName ? personalName : businessName;
};

// Verification Email
export const sendVerificationEmail = async (email, personalName, businessName, token) => {
    const name = getName(personalName, businessName);
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify Your Email',
        text: `Hello ${name},\n\nPlease verify your email by clicking the link: \n${process.env.BASE_URL}/verify-email?token=${token}\n\nIf you did not request this, please ignore this email.\n`
    };
    await transporter.sendMail(mailOptions);
};

// Password Reset Request
export const sendPasswordResetRequestEmail = async (email, personalName, businessName, resetToken) => {
    const name = getName(personalName, businessName);
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset Request',
        text: `Hello ${name},\n\nA password reset was requested for your account. Click the link to reset your password:\n${process.env.BASE_URL}/reset-password?token=${resetToken}\n\nIf you did not request this, please ignore this email.\n`
    };
    await transporter.sendMail(mailOptions);
};

// Password Changed Notification
export const sendPasswordChangedEmail = async (email, personalName, businessName) => {
    const name = getName(personalName, businessName);
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Password Was Changed',
        text: `Hello ${name},\n\nThis is a confirmation that your password was successfully changed.\nIf you did not make this change, please contact us immediately.\n`
    };
    await transporter.sendMail(mailOptions);
};

// Account Deletion Notification
export const sendAccountDeletedEmail = async (email, personalName, businessName) => {
    const name = getName(personalName, businessName);
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Account Has Been Deleted',
        text: `Hello ${name},\n\nWe're notifying you that your account has been deleted.\nIf this was not intended, please reach out to support.\n`
    };
    await transporter.sendMail(mailOptions);
};
