'use client'

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Skeleton } from "@/components/ui/skeleton"
import { Mail } from "lucide-react"
import Autoplay from "embla-carousel-autoplay"
import { useEffect, useState } from "react"
import messages from "@/messages.json"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <main className="flex min-h-screen flex-col items-center bg-background relative overflow-x-hidden">
        <div className="w-full flex flex-col items-center px-4 pt-12 pb-8 md:px-12 md:py-12 lg:px-24 lg:py-16">
          <section className="text-center w-full max-w-4xl mx-auto relative mb-8 md:mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight pb-2">
              <span className="bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
                World of Anonymous
              </span>
              <br />
              <span className="bg-gradient-to-r from-slate-700 to-slate-500 dark:from-slate-200 dark:to-slate-500 bg-clip-text text-transparent">
                Conversation
              </span>
            </h1>
  
            <p className="text-lg md:text-xl lg:text-2xl mt-4 md:mt-6 text-slate-600 dark:text-slate-400 font-light leading-relaxed">
              Explore a world of anonymous conversations, where you can connect
              <br className="hidden md:block" />
              with others without revealing
            </p>
          </section>
  
          <div className="w-full">
            <Carousel 
              plugins={[Autoplay({ delay: 3000 })]}
              className="w-full max-w-md md:max-w-lg lg:max-w-xl mx-auto"
              opts={{
                align: "start",
                loop: true,
              }}
            >
              <CarouselContent>
                {isLoading
                  ? Array.from({ length: 3 }).map((_, index) => (
                      <CarouselItem key={index}>
                        <div className="p-2">
                          <Card className="border border-border/40 backdrop-blur-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
                            <CardHeader className="p-4 flex flex-row items-center gap-3">
                              <Mail className="h-5 w-5 text-muted-foreground" />
                              <Skeleton className="h-6 w-3/4" />
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4 p-6">
                              <Skeleton className="h-12 w-5/6" />
                              <Skeleton className="h-4 w-1/3" />
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))
                  : messages.map((message, index) => (
                      <CarouselItem key={index}>
                        <div className="p-2">
                          <Card className="border border-border/40 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
                            <CardHeader className="flex flex-row items-center gap-3 text-foreground font-semibold p-4 bg-muted/30 group-hover:bg-muted/50 transition-colors duration-300">
                              <Mail className="h-5 w-5 text-foreground" />
                              <span>{message.title}</span>
                            </CardHeader>
                            <CardContent className="p-6">
                              <div className="flex flex-col gap-3">
                                <span className="text-base text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors duration-300">
                                  {message.content}
                                </span>
                                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300 border-t border-border/40 pt-3">
                                  {message.received}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))}
              </CarouselContent>
              <div className="flex justify-center gap-4 mt-4">
                <CarouselPrevious className="bg-background/80 backdrop-blur-sm border-border/40 h-9 w-9 hover:bg-muted/80 hover:border-border transition-all duration-300 hover:scale-110" />
                <CarouselNext className="bg-background/80 backdrop-blur-sm border-border/40 h-9 w-9 hover:bg-muted/80 hover:border-border transition-all duration-300 hover:scale-110" />
              </div>
            </Carousel>
          </div>
        </div>
      </main>
    </>
  )
}