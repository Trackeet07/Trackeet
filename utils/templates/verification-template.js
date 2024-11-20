const verificationTemplate = (firstName, url) => {
  // const OTP = generateOtp(user.emailOtp);
  return `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DashDB</title>
    <link rel="stylesheet"
        href="https://api.fontshare.com/v2/css?f[]=satoshi@300,301,400,401,500,501,700,701,900,901,1,2&display=swap">
    <style>
        .container {
            width: 100% !important;
            max-width: 600px !important;
            height: auto !important;
            padding: 40px 94px 120px !important;
            background: white !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: flex-start !important;
            align-items: center !important;
            box-sizing: border-box !important;
        }

        .content-wrapper {
            align-self: stretch !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: flex-start !important;
            gap: 32px !important;
        }

        .logo {
            width: 92.15px;
            height: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .logo-image {
            width: 100%;
            height: auto;
        }

        .content {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            gap: 16px;
            width: 100%;
        }

        .message-line {
            width: 100%;
            max-width: 467px;
            color: #334155;
            font-size: 16px;
            font-family: 'Satoshi', sans-serif;
            font-weight: 500;
            line-height: 24px;
            word-wrap: break-word;
        }

        .button {
            padding: 10px 32px;
            background: #1D4ED8;
            box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
            border-radius: 4px;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            gap: 6px;
            overflow: hidden;
            width: 100%;
            max-width: 203px;
            text-decoration: none;
            color: white;
            font-size: 16px;
            font-family: 'Satoshi', sans-serif;
            font-weight: 700;
            line-height: 24px;
            word-wrap: break-word;
        }

        .footer {
            width: 100%;
            max-width: 467px;
            color: #334155;
            font-size: 16px;
            font-family: 'Satoshi', sans-serif;
            font-weight: 500;
            line-height: 24px;
            word-wrap: break-word;
        }

        /* Media queries for responsive design */
        @media (max-width: 767px) {
            .container {
                padding: 40px 24px 120px !important;
            }

            .message-line {
                font-size: 14px !important;
                line-height: 20px !important;
            }

            .button {
                font-size: 14px !important;
                line-height: 20px !important;
            }

            .footer {
                font-size: 14px !important;
                line-height: 20px !important;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="content-wrapper">
            <div class="logo">
                <img class="logo-image"
                    src="http://res.cloudinary.com/dqrhrbnhq/image/upload/v1731594322/iitqrtaq8onfdnvwmo0j.jpg" alt="Logo">
            </div>
            <div class="content">
                <div class="message-line">Hi ${firstName},</div>
                <div class="message-line">Thanks for joining us! Your email has been verified, and your account is now ready to go.</div>
                <div class="message-line">Here are a few quick things you can do to get started:</div>
                <div class="message-line">Create a new project.</div>
                <div class="message-line">Connect a data source.</div>
                <div class="message-line">Start building dashboards.</div>
                <div class="message-line">If you have any questions, our support team is here to help.</div>
                <a href= "${url}" class="button">Sign In</a>
                <div class="footer">
                    © DashDB. All rights reserved.
                </div>
            </div>
        </div>
    </div>
</body>

</html>
`;
};

export default verificationTemplate;
