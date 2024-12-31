// import { getServerSession } from "next-auth";
// import { authOptions } from "../../auth/[...nextauth]/options";
// import dbConnect from "@/lib/dbConnect";
// import UserModel from "@/model/User";
// import { Types } from 'mongoose';

// interface CustomUser {
//     _id: string;
//     email: string;
//     username: string;
//     isVerified: boolean;
//     isAcceptingMessage: boolean;
// }

// export async function DELETE(request: Request, { params }: { params: { messageid: string } }) {
//     const messageId = params.messageid;

//     if (!Types.ObjectId.isValid(messageId)) {
//         return Response.json({ success: false, message: 'Invalid message ID format' }, { status: 400 });
//     }

//     await dbConnect();
//     const session = await getServerSession(authOptions);

//     if (!session?.user) {
//         return Response.json({ success: false, message: 'User not authenticated' }, { status: 401 });
//     }

//     const user = session.user as CustomUser;

//     if (!user._id) {
//         return Response.json({ success: false, message: 'User ID not found' }, { status: 400 });
//     }

//     try {
//         const userWithMessage = await UserModel.findOne({
//             _id: new Types.ObjectId(user._id),
//             'messages._id': new Types.ObjectId(messageId)
//         });

//         if (!userWithMessage) {
//             return Response.json({
//                 success: false,
//                 message: 'Message not found or already deleted',
//                 status: 'NOT_FOUND'
//             }, { status: 404 });
//         }

//         const updateResult = await UserModel.updateOne(
//             { _id: new Types.ObjectId(user._id) },
//             { $pull: { messages: { _id: new Types.ObjectId(messageId) } } }
//         );

//         if (updateResult.modifiedCount === 0) {
//             return Response.json({
//                 success: false,
//                 message: 'Failed to delete message',
//                 status: 'DELETE_FAILED'
//             }, { status: 500 });
//         }

//         return Response.json({
//             success: true,
//             message: 'Message deleted successfully',
//             status: 'DELETED'
//         }, { status: 200 });
//     } catch (error) {
//         console.error("Error deleting message:", error);
//         return Response.json({
//             success: false,
//             message: 'Error deleting message',
//             status: 'ERROR'
//         }, { status: 500 });
//     }
// }
























import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Types } from 'mongoose';

interface CustomUser {
    _id: string;
    email: string;
    username: string;
    isVerified: boolean;
    isAcceptingMessage: boolean;
}

// Fixed type definition for the route handler
export async function DELETE(
    request: Request,
    context: { params: { messageid: string } }
) {
    const messageId = context.params.messageid;

    if (!Types.ObjectId.isValid(messageId)) {
        return Response.json({ success: false, message: 'Invalid message ID format' }, { status: 400 });
    }

    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return Response.json({ success: false, message: 'User not authenticated' }, { status: 401 });
    }

    const user = session.user as CustomUser;

    if (!user._id) {
        return Response.json({ success: false, message: 'User ID not found' }, { status: 400 });
    }

    try {
        const userWithMessage = await UserModel.findOne({
            _id: new Types.ObjectId(user._id),
            'messages._id': new Types.ObjectId(messageId)
        });

        if (!userWithMessage) {
            return Response.json({
                success: false,
                message: 'Message not found or already deleted',
                status: 'NOT_FOUND'
            }, { status: 404 });
        }

        const updateResult = await UserModel.updateOne(
            { _id: new Types.ObjectId(user._id) },
            { $pull: { messages: { _id: new Types.ObjectId(messageId) } } }
        );

        if (updateResult.modifiedCount === 0) {
            return Response.json({
                success: false,
                message: 'Failed to delete message',
                status: 'DELETE_FAILED'
            }, { status: 500 });
        }

        return Response.json({
            success: true,
            message: 'Message deleted successfully',
            status: 'DELETED'
        }, { status: 200 });
    } catch (error) {
        console.error("Error deleting message:", error);
        return Response.json({
            success: false,
            message: 'Error deleting message',
            status: 'ERROR'
        }, { status: 500 });
    }
}