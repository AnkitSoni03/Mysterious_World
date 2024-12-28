import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function GET() {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return Response.json(
                { success: false, message: "Not authenticated" },
                { status: 401 }
            );
        }

        const user = await UserModel.findOne({ email: session.user.email });

        if (!user) {
            return Response.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        return Response.json({
            success: true,
            isAcceptingMessage: user.isAcceptingMessage
        });
    } catch (error) {
        console.error("Get accept messages status failed:", error);
        return Response.json(
            { success: false, message: "Failed to fetch accept messages status" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return Response.json(
                { success: false, message: "Not authenticated" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { acceptMessages } = body;

        const user = await UserModel.findOneAndUpdate(
            { email: session.user.email },
            { $set: { isAcceptingMessage: acceptMessages } },
            { new: true }
        );

        if (!user) {
            return Response.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        return Response.json({
            success: true,
            message: `Messages ${acceptMessages ? 'enabled' : 'disabled'} successfully`,
            isAcceptingMessage: user.isAcceptingMessage
        });
    } catch (error) {
        console.error("Update accept messages status failed:", error);
        return Response.json(
            { success: false, message: "Failed to update accept messages status" },
            { status: 500 }
        );
    }
}