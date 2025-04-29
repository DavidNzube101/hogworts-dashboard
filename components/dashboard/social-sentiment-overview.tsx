"use client"

import { useEffect, useState } from "react"
import { TrendingUp, ArrowRight } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

interface SentimentData {
  currentSentiment: number
  sentimentChange24h: number
  socialVolume24h: number
  history: Array<{
    timestamp: string
    sentiment: number
    volume: number
  }>
}

export default function SocialSentimentOverview() {
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

  // Format the sentiment score as a percentage
  const formatSentiment = (score: number) => `${(score * 100).toFixed(0)}%`

  // Determine sentiment label based on score
  const getSentimentLabel = (score: number) => {
    if (score >= 0.7) return "Very Positive"
    if (score >= 0.6) return "Positive"
    if (score >= 0.5) return "Slightly Positive"
    if (score >= 0.4) return "Neutral"
    if (score >= 0.3) return "Slightly Negative"
    if (score >= 0.2) return "Negative"
    return "Very Negative"
  }

  // Get only the last 14 days for the chart
  const chartData = sentiment?.history?.slice(-14) || []

  // Custom tooltip formatter
  const tooltipFormatter = (value: number) => [`${(value * 100).toFixed(0)}%`, "Sentiment"]
  
  // Custom date formatter for x-axis
  const dateFormatter = (date: string) => {
    const d = new Date(date)
    return d.getDate().toString()
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Social Sentiment
        </CardTitle>
        <CardDescription>Public perception analysis across social platforms</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-[150px]" />
            <Skeleton className="h-[150px] w-full" />
          </div>
        ) : error ? (
          <div className="p-4 rounded-lg bg-destructive/10 text-destructive">{error}</div>
        ) : (
          <>
            <div className="mb-4">
              <div className="text-3xl font-bold">{formatSentiment(sentiment?.currentSentiment || 0)}</div>
              <div className="text-sm text-muted-foreground flex items-center">
                {getSentimentLabel(sentiment?.currentSentiment || 0)}
                {sentiment?.sentimentChange24h && sentiment.sentimentChange24h > 0 ? (
                  <span className="ml-2 text-green-600 text-xs font-medium">
                    +{(sentiment.sentimentChange24h * 100).toFixed(1)}%
                  </span>
                ) : sentiment?.sentimentChange24h && sentiment.sentimentChange24h < 0 ? (
                  <span className="ml-2 text-red-600 text-xs font-medium">
                    {(sentiment.sentimentChange24h * 100).toFixed(1)}%
                  </span>
                ) : null}
              </div>
            </div>

            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={dateFormatter}
                    tickMargin={10}
                    dy={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    domain={[0, 1]}
                    tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                    axisLine={false}
                    tickLine={false}
                    dx={-10}
                  />
                  <Tooltip
                    formatter={tooltipFormatter}
                    contentStyle={{
                      backgroundColor: 'var(--background)',
                      borderColor: 'var(--border)',
                      borderRadius: '6px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                  />
                  <Line
                    type="monotone"
                    dataKey="sentiment"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6, stroke: 'var(--primary)', strokeWidth: 2, fill: 'var(--background)' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/social-sentiment">
            View detailed sentiment
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}