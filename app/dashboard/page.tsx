import type { Metadata } from "next"

import AppSidebar from "@/components/app-sidebar"
import OverviewMetrics from "@/components/dashboard/overview-metrics"
import RecentFraudAlerts from "@/components/dashboard/recent-fraud-alerts"
import SocialSentimentOverview from "@/components/dashboard/social-sentiment-overview"
import LatestNews from "@/components/dashboard/latest-news"

export const metadata: Metadata = {
  title: "Dashboard | Hogwarts - Where Magic Meets Data",
  description: "Overview of magical metrics, alerts, and social sentiment",
}

export default async function DashboardPage() {
  return (
    <div className="flex">
      <AppSidebar />
      <div className="flex-1 p-4 md:p-8 md:ml-64 space-y-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Magical Dashboard</h1>
          <p className="text-muted-foreground">Overview of magical metrics, alerts, and social sentiment</p>
        </div>

        <OverviewMetrics />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RecentFraudAlerts />
          <SocialSentimentOverview />
        </div>

        <LatestNews />
      </div>
    </div>
  )
}
