import nodemailer from 'nodemailer';
import winston, { RejectionHandler } from 'winston';
import dotenv from "dotenv";

dotenv.config()
    
const sendEmail = async (msg, subject, receiver) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false
            }
            // host: process.env.EMAIL_HOST,
            // port: 587,
            // secure: false,
            // tls: {
            //     minVersion: 'TLSv1.2', // Enforce TLS 1.2 or higher
            //   },
            // auth: {
            //     user: process.env.EMAIL_USERNAME,
            //     pass: process.env.EMAIL_PASSWORD,
            // },
            
        });

        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            subject: subject,
            html: msg,
            to: receiver,
        });

        return `Message sent', ${nodemailer.getTestMessageUrl(info)}`;
    } catch (err) {
        console.log(err);
        throw new Error("Error sending email");
        // return res.status(500).json({message: "Error sending mail"})
    }
};

// const sendEmail = async (msg, subject, receiver) => {
//     try {
//       const transporter = nodemailer.createTransport({
//         host: EMAIL_HOST,
//         port: 465,
//         secure: true,
//         auth: {
//           user: EMAIL_USERNAME,
//           pass: EMAIL_PASSWORD,
//         },
//         tls: {
//           rejectUnauthorized: false,
//         },
//       });
  
//       const info = await transporter.sendMail({
//         from: EMAIL_FROM,
//         subject: subject,
//         text: msg,
//         to: receiver,
//       });
  
//       return `Message sent: ${info.messageId}, ${nodemailer.getTestMessageUrl(info)}`;
//     } catch (err) {
//       console.error(err);
//       return `Error sending mail: ${err.message}`;
//     }
//   };
export default { sendEmail };

// Configure Winston Logger
// const logger = winston.createLogger({
//   level: 'info',
//   format: winston.format.combine(
//     winston.format.timestamp(),
//     winston.format.json()
//   ),
//   transports: [
//     new winston.transports.Console()
//   ]
// });


// const config = {
//   env: process.env.NODE_ENV,
//   email: {
//       smtp: {
//         host: process.env.EMAIL_HOST,
//         port: process.env.EMAIL_PORT,
//         auth: {
//           user: process.env.EMAIL_USERNAME,
//           pass: process.env.EMAIL_PASSWORD,
//         },
//       },
//       from: process.env.EMAIL_FROM, //Move this to an env file
//     },
//   }
// const transport = nodemailer.createTransport(config.email.smtp);

// if (config.env !== "test") {
//   transport
//     .verify()
//     .then(() => logger.info("Connected to email server"))
//     .catch((error) =>
//       logger.error(
//         "Unable to connect to email server. Make sure you have configured the SMTP options in .env", error
//       )
//     );
// }

// /**
//  * Send an email
//  * @param {string} to
//  * @param {string} subject
//  * @param {string} text
//  * @returns {Promise}
//  */
// const sendEmail = async (to, subject, text) => {
//   const msg = { from: config.email.from, to, subject, text };
//   await transport.sendMail(msg);
// };

// /**
//  * Send reset password email
//  * @param {string} to
//  * @param {string} token
//  * @returns {Promise}
//  */
// const sendResetPasswordEmail = async (to, token) => {
//   const subject = "Reset password";
//   // replace this url with the link to the reset password page of your front-end app
//   const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
//   const text = `Dear user,
//   To reset your password, click on this link: ${resetPasswordUrl}
//   If you did not request any password resets, then ignore this email.`;
//   await sendEmail(to, subject, text);
// };

// const sendVerificationEmail = async (to, token) => {
//   const subject = "Email Verification";
//   // replace this url with the link to the email verification page of your front-end app
//   const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;
//   const text = `Dear user,
//   To verify your email, click on this link: ${verificationEmailUrl}
//   If you did not create an account, then ignore this email.`;
//   await sendEmail(to, subject, text);
// };

// export default {
//   transport,
//   sendEmail,
//   sendResetPasswordEmail,
//   sendVerificationEmail,
// };