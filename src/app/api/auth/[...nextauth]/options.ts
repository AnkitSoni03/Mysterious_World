
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import { User } from "next-auth";

// Define interfaces for our custom types
// interface UserCredentials {
//     identifier: string;
//     password: string;
// }

interface CustomUser extends User {
    id: string;
    email: string;
    username: string;
    isVerified: boolean;
    isAcceptingMessage: boolean;
}

interface CustomSession extends Session {
    user: CustomUser & {
        _id: string;
    };
}

interface CustomJWT extends JWT {
    _id: string;
    email: string;
    username: string;
    isVerified: boolean;
    isAcceptingMessage: boolean;
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                identifier: { label: "Email or Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials): Promise<CustomUser | null> {
                if (!credentials?.identifier || !credentials?.password) {
                    throw new Error("Please provide all required fields");
                }

                await dbConnect();
                try {
                    console.log("Auth attempt:", { 
                        identifier: credentials.identifier,
                        hasPassword: !!credentials.password 
                    });

                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier }
                        ]
                    });

                    if (!user) {
                        throw new Error("No user found with this email or username");
                    }

                    if (!user.isVerified) {
                        throw new Error("Please verify your email before logging in");
                    }

                    const isValid = await bcrypt.compare(credentials.password, user.password);
                    if (!isValid) {
                        throw new Error("Invalid password");
                    }

                    return {
                        id: user.id.toString(),
                        email: user.email,
                        username: user.username,
                        isVerified: user.isVerified,
                        isAcceptingMessage: user.isAcceptingMessage
                    };
                } catch (error) {
                    const err = error as Error;
                    console.error("Auth error:", err.message);
                    throw new Error(err.message);
                }
            }
        })
    ],

    callbacks: {
        async jwt({ token, user }): Promise<CustomJWT> {
            if (user) {
                // Type assertion for user as CustomUser since we know the structure
                const customUser = user as CustomUser;
                return {
                    ...token,
                    _id: customUser.id,
                    email: customUser.email || '',
                    username: customUser.username || '',
                    isVerified: customUser.isVerified || false,
                    isAcceptingMessage: customUser.isAcceptingMessage || false
                } as CustomJWT;
            }
            // Ensure all required properties exist when returning existing token
            return {
                ...token,
                _id: token._id || '',
                email: token.email || '',
                username: token.username || '',
                isVerified: token.isVerified || false,
                isAcceptingMessage: token.isAcceptingMessage || false
            } as CustomJWT;
        },

        async session({ session, token }): Promise<CustomSession> {
            return {
                ...session,
                user: {
                    ...session.user,
                    _id: token._id || '',
                    email: token.email || '',
                    username: token.username || '',
                    isVerified: token.isVerified || false,
                    isAcceptingMessage: token.isAcceptingMessage || false
                }
            } as CustomSession;
        }
    },

    pages: {
        signIn: "/sign-in"
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
};