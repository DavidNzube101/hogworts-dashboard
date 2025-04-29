"use client"

import { useEffect, useState } from "react"
import { TrendingUp, MessageSquare, Users } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

import SentimentOverview from "./sentiment-overview"
import PlatformBreakdown from "./platform-breakdown"
import InfluencersList from "./influencers-list"
import SentimentChart from "./sentiment-chart"

interface SentimentData {
  currentSentiment: number
  sentimentChange24h: number
  socialVolume24h: number
  socialVolumePctChange: number
  sources: Array<{
    source: string
    sentiment: number
    volume: number
    change: number
  }>
  topInfluencers: Array<{
    name: string
    platform: string
    handle: string
    sentiment: number
    recentPost: string
    influence: number
  }>
  history: Array<{
    timestamp: string
    sentiment: number
    volume: number
  }>
}

export default function SocialSentimentDashboard() {
  const [sentiment, setSentiment] = useState<SentimentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSentiment() {
      try {
        const response = await fetch("/api/social-sentiment")

        if (!response.ok) {
          throw new Error("Failed to fetch sentiment data")
        }

        const data = await response.json()
        setSentiment(data)
      } catch (err) {
        setError("Error loading sentiment data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchSentiment()
  }, [])

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            <Skeleton className="h-[140px]" />
            <Skeleton className="h-[140px]" />
            <Skeleton className="h-[140px]" />
            <Skeleton className="h-[140px]" />
          </>
        ) : (
          <SentimentOverview sentiment={sentiment} />
        )}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="platforms">Platform Breakdown</TabsTrigger>
          <TabsTrigger value="influencers">Key Influencers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Sentiment Trend
              </CardTitle>
              <CardDescription>Social sentiment analysis over time</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[350px] w-full" />
              ) : (
                <div className="h-[350px]">
                  <SentimentChart history={sentiment?.history || []} />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                Platform Breakdown
              </CardTitle>
              <CardDescription>Sentiment analysis across different social platforms</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[350px] w-full" />
              ) : (
                <PlatformBreakdown sources={sentiment?.sources || []} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="influencers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-500" />
                Key Opinion Leaders
              </CardTitle>
              <CardDescription>Top influencers and their impact on Solana sentiment</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[350px] w-full" />
              ) : (
                <InfluencersList influencers={sentiment?.topInfluencers || []} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
