// 'use client'
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import * as z from "zod"
// import Link from "next/link"
// import { useEffect, useState } from "react"
// import { useDebounceCallback } from 'usehooks-ts'
// import { useToast } from "@/hooks/use-toast"
// import { useRouter } from "next/navigation"
// import { signUpSchema } from "@/schemas/signUpSchema"
// import axios, { AxiosError } from 'axios'
// import { ApiResonse } from "@/types/ApiResponse"
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Loader2, CheckCircle2, XCircle, Eye, EyeOff } from "lucide-react"

// export default function SignUpPage() {
//     const [username, setUsername] = useState('')
//     const [email, setEmail] = useState('')
//     const [usernameMessage, setUsernameMessage] = useState('')
//     const [emailMessage, setEmailMessage] = useState('')
//     const [isCheckingUsername, setIsCheckingUsername] = useState(false)
//     const [isCheckingEmail, setIsCheckingEmail] = useState(false)
//     const [isSubmitting, setIsSubmitting] = useState(false)
//     const [showPassword, setShowPassword] = useState(false)
//     const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
//     const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null)

//     const debouncedUsername = useDebounceCallback(setUsername, 300)
//     const debouncedEmail = useDebounceCallback(setEmail, 300)
//     const { toast } = useToast()
//     const router = useRouter()

//     const form = useForm({
//         resolver: zodResolver(signUpSchema),
//         defaultValues: {
//             username: '',
//             email: '',
//             password: ''
//         }
//     })

//     useEffect(() => {
//         const checkUsernameUnique = async () => {
//             if (username) {
//                 setIsCheckingUsername(true)
//                 setUsernameMessage('')
//                 setUsernameAvailable(null)
//                 try {
//                     const response = await axios.get(`/api/check-username-unique?username=${username}`)
//                     setUsernameMessage(response.data.message)
//                     setUsernameAvailable(true)
//                 } catch (error) {
//                     const axiosError = error as AxiosError<ApiResonse>
//                     setUsernameMessage(
//                         axiosError.response?.data.message ?? "Error checking username"
//                     )
//                     setUsernameAvailable(false)
//                 } finally {
//                     setIsCheckingUsername(false)
//                 }
//             }
//         }
//         checkUsernameUnique()
//     }, [username])


//     const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
//         setIsSubmitting(true)
//         try {
//             const response = await axios.post<ApiResonse>('/api/sign-up', data)
//             toast({
//                 title: 'OTP Sent!',
//                 description: `A verification code has been sent to ${data.email}`,
//             })
//             router.replace(`/verify/${data.username}`)
//         } catch (error) {
//             const axiosError = error as AxiosError<ApiResonse>
//             let errorMessage = axiosError.response?.data.message
//             toast({
//                 title: "Signup Failed",
//                 description: errorMessage,
//                 variant: "destructive"
//             })
//         } finally {
//             setIsSubmitting(false)
//         }
//     }

//     return (
//         <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
//             <div className="w-full max-w-md space-y-8 bg-card rounded-2xl shadow-2xl border border-border/20 p-10">
//                 <div className="text-center">
//                     <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">
//                         Mistry Messages
//                     </h1>
//                     <p className="text-sm text-muted-foreground">
//                         Create your account to join the conversation
//                     </p>
//                 </div>

//                 <Form {...form}>
//                     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//                         <FormField
//                             control={form.control}
//                             name="username"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Username</FormLabel>
//                                     <div className="relative">
//                                         <FormControl>
//                                             <Input
//                                                 {...field}
//                                                 onChange={(e) => {
//                                                     field.onChange(e);
//                                                     debouncedUsername(e.target.value);
//                                                 }}
//                                             />
//                                         </FormControl>
//                                         {isCheckingUsername && (
//                                             <Loader2 className="h-4 w-4 animate-spin absolute right-3 top-3" />
//                                         )}
//                                         {usernameAvailable === true && !isCheckingUsername && (
//                                             <CheckCircle2 className="h-4 w-4 absolute right-3 top-3 text-green-500" />
//                                         )}
//                                         {usernameAvailable === false && !isCheckingUsername && (
//                                             <XCircle className="h-4 w-4 absolute right-3 top-3 text-red-500" />
//                                         )}
//                                     </div>
//                                     {usernameMessage && (
//                                         <p className={`text-sm mt-2 ${usernameAvailable ? "text-green-500" : "text-red-500"}`}>
//                                             {usernameMessage}
//                                         </p>
//                                     )}
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         <FormField
//                             control={form.control}
//                             name="email"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Email</FormLabel>
//                                     <div className="relative">
//                                         <FormControl>
//                                             <Input
//                                                 {...field}
//                                                 type="email"
//                                                 onChange={(e) => {
//                                                     field.onChange(e);
//                                                     debouncedEmail(e.target.value);
//                                                 }}
//                                                 disabled={isSubmitting}
//                                             />
//                                         </FormControl>
//                                         {isCheckingEmail && (
//                                             <Loader2 className="h-4 w-4 animate-spin absolute right-3 top-3" />
//                                         )}
//                                         {emailAvailable === true && !isCheckingEmail && (
//                                             <CheckCircle2 className="h-4 w-4 absolute right-3 top-3 text-green-500" />
//                                         )}
//                                         {emailAvailable === false && !isCheckingEmail && (
//                                             <XCircle className="h-4 w-4 absolute right-3 top-3 text-red-500" />
//                                         )}
//                                     </div>
//                                     {emailMessage && (
//                                         <p className={`text-sm mt-2 ${emailAvailable ? "text-green-500" : "text-red-500"}`}>
//                                             {emailMessage}
//                                         </p>
//                                     )}
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         <FormField
//                             control={form.control}
//                             name="password"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Password</FormLabel>
//                                     <div className="relative">
//                                         <FormControl>
//                                             <Input
//                                                 {...field}
//                                                 type={showPassword ? "text" : "password"}
//                                                 disabled={isSubmitting}
//                                             />
//                                         </FormControl>
//                                         <button
//                                             type="button"
//                                             onClick={() => setShowPassword(!showPassword)}
//                                             className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
//                                         >
//                                             {showPassword ? (
//                                                 <EyeOff className="h-4 w-4" />
//                                             ) : (
//                                                 <Eye className="h-4 w-4" />
//                                             )}
//                                         </button>
//                                     </div>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         <Button
//                             type="submit"
//                             className="w-full"
//                             disabled={isSubmitting}
//                         >
//                             {isSubmitting && (
//                                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                             )}
//                             Sign Up
//                         </Button>
//                     </form>
//                 </Form>

//                 <div className="text-center">
//                     <p className="text-sm text-muted-foreground">
//                         Already have an account?{' '}
//                         <Link
//                             href="/sign-in"
//                             className="text-primary hover:underline font-semibold"
//                         >
//                             Sign in
//                         </Link>
//                     </p>
//                 </div>
//             </div>
//         </div>
//     )
// }






'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from 'axios'
import { ApiResonse } from "@/types/ApiResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle2, XCircle, Eye, EyeOff } from "lucide-react"

export default function SignUpPage() {
    const [username, setUsername] = useState('')
    const [usernameMessage, setUsernameMessage] = useState('')
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)

    const debouncedUsername = useDebounceCallback(setUsername, 300)
    const { toast } = useToast()
    const router = useRouter()

    const form = useForm({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: ''
        }
    })

    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (username) {
                setIsCheckingUsername(true)
                setUsernameMessage('')
                setUsernameAvailable(null)
                try {
                    await axios.get(`/api/check-username-unique?username=${username}`)
                    setUsernameMessage('Username is available')
                    setUsernameAvailable(true)
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResonse>
                    const errorMsg = axiosError.response?.data.message ?? "Error checking username"
                    setUsernameMessage(errorMsg)
                    setUsernameAvailable(false)
                } finally {
                    setIsCheckingUsername(false)
                }
            }
        }
        checkUsernameUnique()
    }, [username])

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true)
        try {
            await axios.post<ApiResonse>('/api/sign-up', data)
            toast({
                title: 'OTP Sent!',
                description: `A verification code has been sent to ${data.email}`,
            })
            router.replace(`/verify/${data.username}`)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResonse>
            const errorMessage = axiosError.response?.data.message ?? "Signup failed"
            toast({
                title: "Signup Failed",
                description: errorMessage,
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md space-y-8 bg-card rounded-2xl shadow-2xl border border-border/20 p-10">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">
                        Mistry Messages
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Create your account to join the conversation
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <div className="relative">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    debouncedUsername(e.target.value);
                                                }}
                                            />
                                        </FormControl>
                                        {isCheckingUsername && (
                                            <Loader2 className="h-4 w-4 animate-spin absolute right-3 top-3" />
                                        )}
                                        {usernameAvailable === true && !isCheckingUsername && (
                                            <CheckCircle2 className="h-4 w-4 absolute right-3 top-3 text-green-500" />
                                        )}
                                        {usernameAvailable === false && !isCheckingUsername && (
                                            <XCircle className="h-4 w-4 absolute right-3 top-3 text-red-500" />
                                        )}
                                    </div>
                                    {usernameMessage && (
                                        <p className={`text-sm mt-2 ${usernameAvailable ? "text-green-500" : "text-red-500"}`}>
                                            {usernameMessage}
                                        </p>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <div className="relative">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="email"
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <div className="relative">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type={showPassword ? "text" : "password"}
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Sign Up
                        </Button>
                    </form>
                </Form>

                <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link
                            href="/sign-in"
                            className="text-primary hover:underline font-semibold"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}