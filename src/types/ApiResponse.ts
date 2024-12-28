import { Message } from "@/model/User";

export interface ApiResonse {
    success: boolean,
    message: string,
    error?: string,  
    isAcceptingMessage?: boolean,
    messages?: Array<Message>
}