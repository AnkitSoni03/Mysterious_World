import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { recipientUsername, message } = await request.json();

        if (!recipientUsername || !message) {
            return Response.json({
                success: false,
                message: 'Username and message are required'
            }, { status: 400 });
        }

        const user = await UserModel.findOne({ username: recipientUsername });

        if (!user) {
            return Response.json({
                success: false,
                message: `User ${recipientUsername} not found`
            }, { status: 404 });
        }

        if (!user.isAcceptingMessage) {
            return Response.json({
                success: false,
                message: 'This user is not accepting messages at the moment'
            }, { status: 403 });
        }

        const newMessage = {
            content: message,
            createdAt: new Date()
        };

        user.messages.push(newMessage as Message);
        await user.save();

        return Response.json({
            success: true,
            message: 'Message sent successfully'
        }, { status: 200 });
    } catch (error) {
        console.error("Error adding message: ", error);
        return Response.json({
            success: false,
            message: 'Internal server error'
        }, { status: 500 });
    }
}