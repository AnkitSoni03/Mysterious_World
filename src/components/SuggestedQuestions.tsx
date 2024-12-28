import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface SuggestedQuestionsProps {
  questions: string[];
  isLoading: boolean;
  onRefresh: () => void;
}

export function SuggestedQuestions({ 
  questions, 
  isLoading, 
  onRefresh 
}: SuggestedQuestionsProps) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Suggested Questions</CardTitle>
        <Button
          variant="outline"
          size="icon"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : questions.length > 0 ? (
          <div className="grid gap-4">
            {questions.map((question, index) => (
              <Card key={index} className="p-4 hover:bg-gray-50 transition-colors">
                <p className="text-sm text-muted-foreground">{question}</p>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            Click refresh to get suggested questions
          </p>
        )}
      </CardContent>
    </Card>
  );
}