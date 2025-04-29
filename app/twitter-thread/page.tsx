import type { Metadata } from "next"

import AppSidebar from "@/components/app-sidebar"
import TwitterThreadGenerator from "@/components/twitter-thread/twitter-thread-generator"

export const metadata: Metadata = {
  title: "Twitter Thread | Hogwarts - Where Magic Meets Data",
  description: "Generate Twitter threads based on your magical analysis",
}

export default function TwitterThreadPage() {
  return (
    <div className="flex">
      <AppSidebar />
      <div className="flex-1 p-4 md:p-8 md:ml-64 space-y-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Magical Threads</h1>
          <p className="text-muted-foreground">Generate Twitter threads based on your magical analysis findings</p>
        </div>

        <TwitterThreadGenerator />
      </div>
    </div>
  )
}
