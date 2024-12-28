'use client';
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RefreshCw, Loader2, UserPlus, Sun, Moon } from 'lucide-react';
import { useSuggestedMessages } from '@/hooks/use-suggested-messages';
import { useToast } from '@/hooks/use-toast';
import { useParams } from 'next/navigation';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import axios from 'axios';

const MessagePage = () => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { suggestedMessages, fetchSuggestedMessages } = useSuggestedMessages();
  const { toast } = useToast();
  const params = useParams();
  const username = params.username as string;
  const { theme, setTheme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a message',
        variant: 'destructive',
      });
      return;
    }

    setIsSending(true);
    try {
      const response = await axios.post('/api/send-message', {
        recipientUsername: username,
        message: message.trim(),
      });

      if (response.data.success) {
        toast({
          title: 'Success',
          description: response.data.message,
        });
        setMessage('');
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message || 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-all duration-300">
      <div className="fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full w-10 h-10 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>

      <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-8 pt-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold">
            Public Profile Link
          </h1>
        </div>

        <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg">
          <CardContent className="p-4 md:p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <p className="text-lg md:text-xl mb-4 text-center md:text-left">
                  Send Anonymous Message to{' '}
                  <span className="font-semibold">@{username}</span>
                </p>
                <Textarea
                  placeholder="Write your anonymous message here"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[120px] md:min-h-[150px] w-full p-4 rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                  disabled={isSending}
                />
              </div>
              <div className="flex justify-center">
                <Button
                  type="submit"
                  className="w-full md:w-auto px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-md hover:opacity-90 transition-all"
                  disabled={isSending}
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="flex justify-center md:justify-start">
            <Button
              variant="secondary"
              className="w-full md:w-auto px-6 py-3 bg-gray-900 dark:bg-gray-100 hover:bg-black dark:hover:bg-white text-white dark:text-black font-medium rounded-md transition-all"
              onClick={fetchSuggestedMessages}
              disabled={suggestedMessages.isLoading}
            >
              <RefreshCw
                className={`h-5 w-5 mr-2 ${suggestedMessages.isLoading ? 'animate-spin' : ''}`}
              />
              Get AI Suggestions
            </Button>
          </div>

          <Card className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg">
            <CardContent className="p-4 space-y-4">
              {suggestedMessages.isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((index) => (
                    <div
                      key={index}
                      className="p-3 rounded-md animate-pulse bg-gray-200 dark:bg-gray-800"
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {suggestedMessages.questions.length > 0 ? (
                    suggestedMessages.questions.map((msg, index) => (
                      <div
                        key={index}
                        onClick={() => setMessage(msg)}
                        className="p-4 border border-gray-300 dark:border-gray-700 rounded-md cursor-pointer bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
                      >
                        {msg}
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-lg text-gray-600 dark:text-gray-400">
                      Click "Get AI Suggestions" for message ideas
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col items-center space-y-4 pt-6">
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
              Your privacy is always our top priority.
            </p>
            <Link href="/" className="w-full md:w-auto">
              <Button className="w-full md:w-auto px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-md hover:opacity-90 transition-all">
                <UserPlus className="w-5 h-5 mr-2" /> Create Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagePage;