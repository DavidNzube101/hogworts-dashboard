"use client"

import { useEffect, useState } from "react"
import { Newspaper, ExternalLink } from "lucide-react"
import Link from "next/link"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface NewsItem {
  id: string
  title: string
  content: string
  url: string
  published_at: string
  author: string
  source: string
  tags: string[]
  sentiment: "positive" | "negative" | "neutral"
}

export default function NewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sentimentFilter, setSentimentFilter] = useState("all")

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch("/api/news-feed")

        if (!response.ok) {
          throw new Error("Failed to fetch news data")
        }

        const data = await response.json()
        setNews(data.news || [])
        setFilteredNews(data.news || [])
      } catch (err) {
        setError("Error loading news data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  // Apply filters when search or sentiment filter changes
  useEffect(() => {
    let results = news

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      results = results.filter(
        (item) => item.title.toLowerCase().includes(query) || item.content.toLowerCase().includes(query),
      )
    }

    // Apply sentiment filter
    if (sentimentFilter !== "all") {
      results = results.filter((item) => item.sentiment === sentimentFilter)
    }

    setFilteredNews(results)
  }, [searchQuery, sentimentFilter, news])

  // Format the date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Get sentiment badge based on sentiment
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-purple-500" />
            News Feed
          </CardTitle>
          <CardDescription>Latest news and updates from the Solana ecosystem</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full sm:w-48">
              <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by sentiment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sentiment</SelectItem>
                  <SelectItem value="positive">Positive</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                  <SelectItem value="negative">Negative</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : error ? (
            <div className="p-4 rounded-lg bg-red-50 text-red-700">{error}</div>
          ) : filteredNews.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No news found matching your filters</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("")
                  setSentimentFilter("all")
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNews.map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                    <h3 className="font-medium">
                      <Link href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {item.title}
                        <ExternalLink className="inline ml-1 h-3 w-3" />
                      </Link>
                    </h3>
                    {getSentimentBadge(item.sentiment)}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {item.source} • {formatDate(item.published_at)} • By {item.author}
                  </div>
                  <p className="text-sm mt-2">{item.content}</p>
                  {item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {item.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
