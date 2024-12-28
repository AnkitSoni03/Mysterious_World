import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { sendWelcomeEmail } from "@/helpers/sendWelcomeEmail";

export async function POST(request: Request) {
    console.log('API route hit: /api/verify-code');
    await dbConnect();

    try {
        const body = await request.json();
        console.log('Received request body:', body);

        const { username, code } = body;
        const decodedUsername = decodeURIComponent(username);

        const user = await UserModel.findOne({
            username: { $regex: new RegExp('^' + decodedUsername + '$', 'i') }
        });

        if (!user) {
            console.log('User search criteria:', { username: decodedUsername });
            console.log('Available users:', await UserModel.find({}, 'username'));
            return Response.json({
                success: false,
                message: 'User not found'
            }, { status: 404 });
        }

        console.log('Found user:', user.username);
        console.log('Verification details:', {
            providedCode: code,
            storedCode: user.verifyCode,
            expiry: user.verifyCodeExpiry
        });

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if (!isCodeValid || !isCodeNotExpired) {
            return Response.json({
                success: false,
                message: !isCodeValid ? 'Invalid verification code' : 'Code expired'
            }, { status: 400 });
        }

        user.isVerified = true;
        await user.save();

        try {
            await sendWelcomeEmail(user.email, user.username);
            console.log('Welcome email sent successfully to:', user.email);
        } catch (emailError) {
            console.error('Error sending welcome email:', emailError);
        }

        return Response.json({
            success: true,
            message: 'Account verified successfully'
        }, { status: 200 });

    } catch (error) {
        console.error("Error verifying user:", error);
        return Response.json({
            success: false,
            message: 'Error verifying user'
        }, { status: 500 });
    }
}
