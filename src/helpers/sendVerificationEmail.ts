import { transporter } from "@/lib/nodemailer";
import { getVerificationEmailTemplate } from "@/lib/emailTemplates";
import { ApiResonse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResonse> {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Mysterious World | Verify your email',
            html: getVerificationEmailTemplate({ username, otp: verifyCode })
        };

        const info = await transporter.sendMail(mailOptions);

        console.log("Email sent successfully to:", email, "Info:", info);
        return {
            success: true,
            message: "Verification email sent successfully"
        };
    }
    catch (emailError) {
        console.error("Error sending verification email to:", email, "Error:", emailError);
        return {
            success: false,
            message: "Failed to send verification email",
            error: emailError instanceof Error ? emailError.message : 'Unknown error'
        };
    }
}