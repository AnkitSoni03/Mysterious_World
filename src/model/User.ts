import mongoose, { Schema, Document } from "mongoose";


/* Interface design for message*/
export interface Message extends Document {
    _id: string
    content: string,
    createdAt: Date
}

/*Schema design for message*/
const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    }
})


/* Interface design for User*/
export interface User extends Document {
    username: string,
    email: string,
    password: string,
    verifyCode: string,
    verifyCodeExpiry: Date,
    isVerified: boolean,
    isAcceptingMessage: boolean,
    messages: Message[]
}

/*Schema design for User*/
const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'please provide a valid email']
    },

    password: {
        type: String,
        required: [true, "Password is required"],
    },

    verifyCode: {
        type: String,
        required: [true, "Verification code is required"],
    },

    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verification code expiry is required"],
    },

    isVerified: {
        type: Boolean,
        default: false,
    },

    isAcceptingMessage: {
        type: Boolean,
        default: true,
    },

    messages: [MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);

export default UserModel;