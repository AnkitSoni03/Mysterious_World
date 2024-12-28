import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function GET() {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return Response.json({
                success: false,
                message: "Not authenticated"
            }, { status: 401 });
        }

        const user = await UserModel.findOne({ email: session.user.email });

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        const sortedMessages = user.messages
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        return Response.json({
            success: true,
            messages: sortedMessages
        }, { status: 200 });

    } catch (error) {
        console.error("Get messages failed:", error);
        return Response.json({
            success: false,
            message: "Failed to fetch messages"
        }, { status: 500 });
    }
}