'use client'

import { useToast } from "@/hooks/use-toast"
import { Message } from "@/model/User"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { User as NextAuthUser } from "next-auth"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import MessageCard from "@/components/MessageCard"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RefreshCw, Link as LinkIcon, Loader2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface DashboardFormData {
  acceptMessages: boolean
}

interface ApiResponse {
  success: boolean
  message: string
  messages?: Message[]
  isAcceptingMessage?: boolean
}

export default function Dashboard() {
  const [messages, setMessages] = useState<(Message & { _id: string })[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSwitching, setIsSwitching] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()
  const { data: session, status } = useSession()

  const form = useForm<DashboardFormData>({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: {
      acceptMessages: true
    }
  })

  const { watch, setValue } = form
  const acceptMessages = watch('acceptMessages')

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await axios.delete(`/api/delete-message/${messageId}`)
      setMessages(messages.filter((message) => message._id !== messageId))
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to delete message",
        variant: "destructive"
      })
    }
  }

  const fetchAcceptMessage = useCallback(async () => {
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages')
      setValue('acceptMessages', response.data.isAcceptingMessage ?? true)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to fetch message settings",
        variant: "destructive"
      })
    }
  }, [setValue, toast])

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    if (refresh) {
      setIsRefreshing(true)
    } else {
      setIsLoading(true)
    }

    try {
      const response = await axios.get<ApiResponse>('/api/get-messages');
      setMessages(response.data.messages || []);
      if (refresh) {
        toast({
          title: "Success",
          description: "Messages refreshed successfully"
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to fetch messages",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [toast])

  useEffect(() => {
    if (status === "authenticated") {
      fetchMessages()
      fetchAcceptMessage()
    }
  }, [status, fetchMessages, fetchAcceptMessage])

  const handleSwitchChange = async () => {
    setIsSwitching(true)
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages
      })
      setValue('acceptMessages', !acceptMessages)
      toast({
        title: "Success",
        description: response.data.message
      })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to update settings",
        variant: "destructive"
      })
    } finally {
      setIsSwitching(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Please login to access your dashboard</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const user = session?.user as NextAuthUser & { username: string }
  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const profileUrl = `${baseUrl}/u/${user.username}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast({
      description: "Profile URL copied to clipboard"
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-8">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="space-y-6">
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200 mx-4 md:mx-0">
            <CardHeader className="space-y-2 p-4 md:p-6">
              <CardTitle className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 text-center md:text-left break-words">
                Welcome back, @{user.username}!
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-gray-900 dark:text-gray-100">
                <LinkIcon className="h-5 w-5" />
                Share Your Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  value={profileUrl}
                  readOnly
                  className="bg-gray-50 dark:bg-gray-800 font-mono text-sm text-gray-900 dark:text-gray-100"
                />
                <Button
                  onClick={copyToClipboard}
                  variant="secondary"
                  className="min-w-[100px]"
                >
                  Copy Link
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900 dark:text-gray-100">Message Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label htmlFor="accept-messages" className="text-base text-gray-900 dark:text-gray-100">
                  Accept new messages
                </Label>
                <Switch
                  id="accept-messages"
                  checked={acceptMessages}
                  onCheckedChange={handleSwitchChange}
                  disabled={isSwitching}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl text-gray-900 dark:text-gray-100">Messages</CardTitle>
              <Button
                variant="outline"
                size="icon"
                onClick={() => fetchMessages(true)}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                      <CardHeader>
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-20 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : messages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {messages.map((message) => (
                    <MessageCard
                      key={message._id}
                      message={message}
                      onMessageDelete={handleDeleteMessage}
                      onRefresh={() => fetchMessages(true)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground dark:text-gray-400">No messages to display</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

}