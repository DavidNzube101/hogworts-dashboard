import { NextResponse } from "next/server"
import { fetchAssetMetrics, analyzeSocialSentiment } from "@/lib/api/messari"

export async function GET() {
  try {
    // Fetch metrics data for SOL
    const metricsData = await fetchAssetMetrics("SOL")

    // Get social sentiment analysis
    const sentimentData = await analyzeSocialSentiment("SOL")

    // Since Messari's free API doesn't provide comprehensive social sentiment data,
    // we'll supplement with some mock data for demonstration purposes

    // Mock social sentiment data by platform
    const sentiment = [
      {
        source: "Twitter",
        sentiment: 0.72,
        volume: metricsData.data.twitter?.followers || 12500,
        change: sentimentData.sentimentChange24h || 0.05,
      },
      { source: "Reddit", sentiment: 0.64, volume: 3800, change: -0.02 },
      { source: "Discord", sentiment: 0.81, volume: 8200, change: 0.12 },
      { source: "Telegram", sentiment: 0.58, volume: 5400, change: -0.08 },
    ]

    // Mock KOL (Key Opinion Leaders) data
    const keyOpinionLeaders = [
      {
        name: "Anatoly Yakovenko",
        platform: "Twitter",
        handle: "@aeyakovenko",
        sentiment: 0.85,
        recentPost: "Exciting developments in the Solana ecosystem with new validator improvements.",
        influence: 92,
      },
      {
        name: "Raj Gokal",
        platform: "Twitter",
        handle: "@rajgokal",
        sentiment: 0.78,
        recentPost: "Solana's mobile strategy is continuing to expand with new partnerships.",
        influence: 88,
      },
      {
        name: "Armani Ferrante",
        platform: "Twitter",
        handle: "@armaniv_",
        sentiment: 0.82,
        recentPost: "Coral ecosystem continues to grow with new innovative projects launching.",
        influence: 81,
      },
    ]

    // Generate mock sentiment history
    const timestampNow = Date.now()
    const day = 24 * 60 * 60 * 1000
    const sentimentHistory = Array.from({ length: 30 }, (_, i) => {
      // Create some realistic patterns with weekends having higher sentiment
      const dayOfWeek = new Date(timestampNow - (29 - i) * day).getDay()
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

      // Base sentiment with some oscillation and weekend boost
      const baseSentiment = 0.6 + Math.sin(i / 5) * 0.1 + (isWeekend ? 0.1 : 0)

      return {
        timestamp: new Date(timestampNow - (29 - i) * day).toISOString().split("T")[0],
        sentiment: Number(baseSentiment.toFixed(2)),
        volume: Math.floor(8000 + Math.random() * 7000 + (isWeekend ? 3000 : 0)),
      }
    })

    return NextResponse.json({
      currentSentiment: sentimentData.sentimentScore,
      sentimentChange24h: sentimentData.sentimentChange24h,
      socialVolume24h: metricsData.data.twitter?.followers || 30000,
      socialVolumePctChange: sentimentData.twitterMetrics.followerGrowthRate,
      sources: sentiment,
      topInfluencers: keyOpinionLeaders,
      history: sentimentHistory,
      twitterMetrics: sentimentData.twitterMetrics,
    })
  } catch (error) {
    console.error("Error fetching social sentiment data:", error)
    return NextResponse.json({ error: "Failed to fetch social sentiment data" }, { status: 500 })
  }
}
