import type { Metadata } from "next"

import AppSidebar from "@/components/app-sidebar"
import SocialSentimentDashboard from "@/components/social-sentiment/sentiment-dashboard"

export const metadata: Metadata = {
  title: "Social Sentiment | Hogwarts - Where Magic Meets Data",
  description: "Analyze social media sentiment and trends in the wizarding world",
}

export default function SocialSentimentPage() {
  return (
    <div className="flex">
      <AppSidebar />
      <div className="flex-1 p-4 md:p-8 md:ml-64 space-y-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Magical Sentiment</h1>
          <p className="text-muted-foreground">Analyze social media sentiment and trends in the wizarding world</p>
        </div>

        <SocialSentimentDashboard />
      </div>
    </div>
  )
}
