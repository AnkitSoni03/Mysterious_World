import { transporter } from "@/lib/nodemailer";
import { getWelcomeEmailTemplate } from "@/lib/emailTemplates";
import { ApiResonse } from "@/types/ApiResponse";

export async function sendWelcomeEmail(
    email: string,
    username: string
): Promise<ApiResonse> {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to Mysterious World! Account Verified Successfully',
            html: getWelcomeEmailTemplate({ username })
        };

        const info = await transporter.sendMail(mailOptions);

        console.log("Welcome email sent successfully to:", email, "Info:", info);
        return {
            success: true,
            message: "Welcome email sent successfully"
        };
    }
    catch (emailError) {
        console.error("Error sending welcome email to:", email, "Error:", emailError);
        return {
            success: false,
            message: "Failed to send welcome email",
            error: emailError instanceof Error ? emailError.message : 'Unknown error'
        };
    }
}