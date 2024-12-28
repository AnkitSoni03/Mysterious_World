'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { verifySchema } from "@/schemas/verifySchema"
import { ApiResonse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Mail } from "lucide-react"

export default function VerifyAccount() {
    const router = useRouter()
    const params = useParams<{ username: string }>()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: ''
        }
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        if (isLoading) return
        setIsLoading(true)

        try {
            const decodedUsername = decodeURIComponent(params.username)
            console.log('Sending verification request for username:', decodedUsername);

            const response = await axios.post(`${window.location.origin}/api/verify-code`, {
                username: decodedUsername,
                code: data.code
            })

            console.log('Verification response:', response.data);

            toast({
                title: "Success",
                description: response.data.message
            })

            form.reset()
            router.replace("/sign-in")

        } catch (error) {
            console.error("Error verifying user:", error)
            const axiosError = error as AxiosError<ApiResonse>

            toast({
                title: "Verification Failed",
                description: axiosError.response?.data.message ||
                    axiosError.message ||
                    "Network error occurred. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                <div className="flex items-center justify-center mb-6">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Mail className="h-6 w-6 text-primary" />
                    </div>
                </div>

                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
                        Verify Account
                    </h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Please enter the verification code sent to your email
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-300">
                                        Verification Code
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your code"
                                            {...field}
                                            className="text-center text-lg tracking-widest"
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-sm" />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="w-full mt-6 text-base font-medium"
                            disabled={isLoading}
                        >
                            {isLoading ? "Verifying..." : "Verify Account"}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}