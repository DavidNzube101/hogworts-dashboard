import { NextResponse } from "next/server"
import { fetchNews } from "@/lib/api/messari"

// Simple sentiment analysis function
function analyzeSentiment(text: string): "positive" | "negative" | "neutral" {
  // Convert to lowercase for case-insensitive matching
  const lowerText = text.toLowerCase()

  // Define keyword lists
  const positiveKeywords = [
    "bullish",
    "surge",
    "soar",
    "rally",
    "gain",
    "rise",
    "grow",
    "positive",
    "breakthrough",
    "adoption",
    "partnership",
    "launch",
    "success",
    "milestone",
  ]

  const negativeKeywords = [
    "bearish",
    "crash",
    "plunge",
    "drop",
    "fall",
    "decline",
    "tumble",
    "negative",
    "scam",
    "hack",
    "fraud",
    "attack",
    "vulnerability",
    "concern",
    "risk",
    "warning",
  ]

  // Count keyword occurrences
  let positiveCount = 0
  let negativeCount = 0

  positiveKeywords.forEach((keyword) => {
    const regex = new RegExp(`\\b${keyword}\\b`, "g")
    const matches = lowerText.match(regex)
    if (matches) positiveCount += matches.length
  })

  negativeKeywords.forEach((keyword) => {
    const regex = new RegExp(`\\b${keyword}\\b`, "g")
    const matches = lowerText.match(regex)
    if (matches) negativeCount += matches.length
  })

  // Determine sentiment
  if (positiveCount > negativeCount + 1) return "positive"
  if (negativeCount > positiveCount + 1) return "negative"
  return "neutral"
}

// Extract tags from news content
function extractTags(title: string, content: string): string[] {
  const combinedText = `${title} ${content}`.toLowerCase()

  // Common Solana ecosystem tags
  const potentialTags = [
    "solana",
    "sol",
    "nft",
    "defi",
    "blockchain",
    "crypto",
    "token",
    "wallet",
    "transaction",
    "validator",
    "staking",
    "yield",
    "trading",
    "exchange",
    "dex",
    "dao",
    "governance",
    "protocol",
    "security",
    "development",
    "update",
  ]

  return potentialTags.filter((tag) => combinedText.includes(tag))
}

export async function GET() {
  try {
    const newsData = await fetchNews("solana", 30)

    // Process news data for simpler consumption by the frontend
    const processedNews = newsData.data.map((item: any) => {
      const title = item.title || ""
      const content = item.content || ""

      return {
        id: item.id,
        title: title,
        content: content,
        url: item.url,
        published_at: item.published_at,
        author: item.author?.name || "Unknown",
        source: item.url.split("/")[2],
        tags: extractTags(title, content),
        sentiment: analyzeSentiment(title + " " + content),
      }
    })

    return NextResponse.json({
      news: processedNews,
      total: processedNews.length,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching news data:", error)
    return NextResponse.json({ error: "Failed to fetch news data" }, { status: 500 })
  }
}
