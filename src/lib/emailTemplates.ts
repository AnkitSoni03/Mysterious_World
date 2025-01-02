interface EmailTemplateProps {
    username: string;
    otp: string;
}

interface WelcomeEmailProps {
    username: string;
}

export function getVerificationEmailTemplate({ username, otp }: EmailTemplateProps): string {
    return `
<!DOCTYPE html>
<html lang="en" dir="ltr">
    <head>
        <meta charset="utf-8">
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
        <title>Email Verification</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Roboto', Verdana, sans-serif;">
        <div style="
            background-color: #ffffff;
            padding: 40px;
            border-radius: 5px;
            max-width: 600px;
            margin: 0 auto;
            font-family: 'Roboto', Verdana, sans-serif;"
        >
            <div>
                <h2 style="
                    color: #333333;
                    font-size: 24px;
                    margin-bottom: 20px;"
                >
                    Hello ${username},
                </h2>
            </div>
            
            <div>
                <p style="
                    color: #666666;
                    font-size: 16px;
                    line-height: 24px;"
                >
                    Thank you for registering with Mysterious World. To complete your registration, 
                    please use the verification code below:
                </p>
            </div>
            
            <div style="
                margin: 30px 0;
                text-align: center;"
            >
                <div style="
                    background-color: #f4f4f4;
                    padding: 20px;
                    border-radius: 5px;
                    font-size: 32px;
                    font-weight: bold;
                    letter-spacing: 5px;
                    color: #333333;
                    display: inline-block;"
                >
                    ${otp}
                </div>
            </div>
            
            <div>
                <p style="
                    color: #666666;
                    font-size: 14px;
                    font-style: italic;"
                >
                    This code will expire in 1 hour. If you did not register with Mysterious World, 
                    please ignore this email.
                </p>
            </div>
        </div>
    </body>
</html>
    `;
}

export function getWelcomeEmailTemplate({ username }: WelcomeEmailProps): string {
    
    return `
<!DOCTYPE html>
<html lang="en" dir="ltr">
    <head>
        <meta charset="utf-8">
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
        <title>Welcome to True Feedback</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Roboto', Verdana, sans-serif;">
        <div style="
            background-color: #ffffff;
            padding: 40px;
            border-radius: 5px;
            max-width: 600px;
            margin: 0 auto;
            font-family: 'Roboto', Verdana, sans-serif;"
        >
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="
                    background-color: #4CAF50;
                    border-radius: 50%;
                    width: 60px;
                    height: 60px;
                    margin: 0 auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;"
                >
                    <span style="color: white; font-size: 30px;">✓</span>
                </div>
            </div>

            <div style="text-align: center;">
                <h1 style="
                    color: #333333;
                    font-size: 28px;
                    margin-bottom: 20px;"
                >
                    Welcome to Mysterious WorldS!
                </h1>
                
                <h2 style="
                    color: #4CAF50;
                    font-size: 24px;
                    margin-bottom: 30px;"
                >
                    Account Successfully Verified
                </h2>
            </div>
            
            <div>
                <p style="
                    color: #666666;
                    font-size: 16px;
                    line-height: 24px;
                    text-align: center;"
                >
                    Dear ${username},
                </p>
                
                <p style="
                    color: #666666;
                    font-size: 16px;
                    line-height: 24px;
                    text-align: center;"
                >
                    Congratulations! Your account has been successfully verified. 
                    You now have full access to all Mysterious World features.
                </p>
            </div>
            
            <div style="margin: 30px 0; text-align: center;">
                <a href="${'https://mysterious-world-lime.vercel.app/sign-in'}"
                    style="
                        background-color: #4CAF50;
                        padding: 15px 30px;
                        border-radius: 5px;
                        font-size: 16px;
                        font-weight: bold;
                        color: white;
                        display: inline-block;
                        text-decoration: none;
                        cursor: pointer;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        transition: background-color 0.3s ease;"
                    target="_blank"
                >
                    Start Exploring
                </a>
            </div>

            <div style="margin-top: 40px; text-align: center; border-top: 1px solid #eee; padding-top: 20px;">
                <p style="
                    color: #666666;
                    font-size: 14px;"
                >
                    If you have any questions or need assistance, feel free to contact our support team.
                </p>
                
                <p style="
                    color: #999999;
                    font-size: 12px;
                    margin-top: 20px;"
                >
                    © ${new Date().getFullYear()} Mysterious World. All rights reserved.
                </p>
            </div>
        </div>
    </body>
</html>
    `;
}