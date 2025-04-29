"use client"

import { useEffect, useState } from "react"
import { Newspaper, ExternalLink } from "lucide-react"
import Link from "next/link"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

interface NewsItem {
  id: string
  title: string
  content: string
  url: string
  published_at: string
  author: string
  source: string
  sentiment: "positive" | "negative" | "neutral"
}

export default function LatestNews() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch("/api/news-feed")

        if (!response.ok) {
          throw new Error("Failed to fetch news data")
        }

        const data = await response.json()
        setNews(data.news || [])
      } catch (err) {
        setError("Error loading news data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  // Format the date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // Get the sentiment badge variant based on sentiment
  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Positive
          </Badge>
        )
      case "negative":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Negative
          </Badge>
        )
      default:
        return <Badge variant="outline">Neutral</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-purple-500" />
          Latest News
        </CardTitle>
        <CardDescription>Recent news and developments in the Solana ecosystem</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : error ? (
          <div className="p-4 rounded-lg bg-red-50 text-red-700">{error}</div>
        ) : (
          <div className="space-y-4">
            {news.slice(0, 5).map((item) => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-medium text-sm">
                    <Link href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {item.title}
                      <ExternalLink className="inline ml-1 h-3 w-3" />
                    </Link>
                  </h3>
                  {getSentimentBadge(item.sentiment)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {item.source} • {formatDate(item.published_at)}
                </div>
                <p className="text-xs mt-2 line-clamp-2">{item.content}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
