'use client'

import { useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios, { AxiosError } from "axios";
import { formatDistanceToNow } from "date-fns";
import { Message } from "@/model/User";

interface MessageCardProps {
    message: Message & {
        _id: string;  
    };
    onMessageDelete: (messageId: string) => void;
    onRefresh: () => void;  
}

export default function MessageCard({ message, onMessageDelete, onRefresh }: MessageCardProps) {
    const { toast } = useToast();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
    const handleDeleteConfirm = async () => {
        if (isDeleting) return;
        
        setIsDeleting(true);
        try {
            const response = await axios.delete(`/api/delete-message/${message._id}`);
            
            setIsDialogOpen(false);

            if (response.data.success) {
                toast({
                    title: "Success",
                    description: response.data.message
                });
                onMessageDelete(message._id);
                onRefresh(); 
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string, status: string }>;
            const errorMessage = axiosError.response?.data?.message || "Failed to delete message";
            const errorStatus = axiosError.response?.data?.status;

            toast({
                title: errorStatus === 'NOT_FOUND' ? "Message Not Found" : "Error",
                description: errorMessage,
                variant: "destructive"
            });

           
            if (errorStatus === 'NOT_FOUND') {
                onMessageDelete(message._id);
                onRefresh();
            }
        } finally {
            setIsDeleting(false);
        }
    }

    const formattedDate = formatDistanceToNow(new Date(message.createdAt), { 
        addSuffix: true 
    });

    return (
        <Card className="relative">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-medium">Message</CardTitle>
                    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <AlertDialogTrigger asChild>
                            <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-red-500"
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Trash2 className="h-4 w-4" />
                                )}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Message</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete this message? This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                    onClick={handleDeleteConfirm}
                                    className="bg-red-500 hover:bg-red-600"
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Deleting...
                                        </>
                                    ) : (
                                        'Delete'
                                    )}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                <CardDescription>{formattedDate}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {message.content}
                </p>
            </CardContent>
        </Card>
    );
}