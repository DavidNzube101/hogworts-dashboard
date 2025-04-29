import type { Metadata } from "next"

import AppSidebar from "@/components/app-sidebar"
import NewsFeed from "@/components/news-feed/news-feed"

export const metadata: Metadata = {
  title: "News Feed | Hogwarts - Where Magic Meets Data",
  description: "Latest news and developments in the wizarding world",
}

export default function NewsFeedPage() {
  return (
    <div className="flex">
      <AppSidebar />
      <div className="flex-1 p-4 md:p-8 md:ml-64 space-y-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Magical News</h1>
          <p className="text-muted-foreground">Latest news and developments in the wizarding world</p>
        </div>

        <NewsFeed />
      </div>
    </div>
  )
}
