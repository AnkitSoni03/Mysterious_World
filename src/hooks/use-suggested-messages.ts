import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

interface SuggestedMessage {
  questions: string[];
  isLoading: boolean;
}

export function useSuggestedMessages() {
  const { toast } = useToast();
  const [suggestedMessages, setSuggestedMessages] = useState<SuggestedMessage>({
    questions: [],
    isLoading: false
  });

  const fetchSuggestedMessages = async () => {
    setSuggestedMessages(prev => ({ ...prev, isLoading: true }));
    
    try {
      const response = await fetch('/api/suggest-messages', {
        method: 'POST'
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setSuggestedMessages({
        questions: data.questions,
        isLoading: false
      });
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestedMessages(prev => ({ ...prev, isLoading: false }));
      toast({
        title: "Error",
        description: "Failed to fetch AI suggestions",
        variant: "destructive"
      });
    }
  };

  return { suggestedMessages, fetchSuggestedMessages };
}