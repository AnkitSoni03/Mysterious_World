'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { signInSchema } from "@/schemas/signInSchema"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { useState } from "react"

export default function SignInPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: ''
        }
    })

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        try {
            setIsLoading(true)
            
            const result = await signIn('credentials', {
                redirect: false,
                identifier: data.identifier,
                password: data.password
            })

            if (result?.error) {
                let errorMessage = "An error occurred during sign in"
                
                switch (result.error) {
                    case "CredentialsSignin":
                        errorMessage = "Invalid credentials. Please check your email/username and password."
                        break
                    case "UserNotVerified":
                        errorMessage = "Please verify your email before signing in."
                        break
                }

                toast({
                    title: "Login Failed",
                    description: errorMessage,
                    variant: "destructive"
                })
                return
            }

            if (result?.url) {
                toast({
                    title: "Success",
                    description: "Successfully signed in!",
                })
                router.replace('/dashboard')
            }
        } catch (error) {
            console.error('Sign in error:', error)
            toast({
                title: "Error",
                description: "An unexpected error occurred. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/80 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md space-y-8 bg-card/95 backdrop-blur-sm rounded-3xl shadow-xl border border-border/10 p-12 transition-all duration-300 hover:shadow-2xl">
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 text-transparent bg-clip-text">
                        Welcome Back
                    </h1>
                    <p className="text-base text-muted-foreground">
                        Continue your anonymous journey
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="identifier"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-foreground/80">Email/Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className="h-12 px-4 bg-background/50 border-border/20 focus-visible:ring-primary/30"
                                            placeholder="Enter your email/username"
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-foreground/80">Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="password"
                                            className="h-12 px-4 bg-background/50 border-border/20 focus-visible:ring-primary/30"
                                            placeholder="Enter your password"
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-semibold transition-all duration-300 hover:scale-[1.02]"
                            disabled={isLoading}
                        >
                            {isLoading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>
                </Form>

                <div className="pt-4 text-center border-t border-border/10">
                    <p className="text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <Link
                            href="/sign-up"
                            className="text-primary hover:text-primary/80 font-semibold transition-colors"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}