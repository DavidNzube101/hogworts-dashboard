import { TrendingUp, MessageSquare, Users, Activity } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SentimentOverviewProps {
  sentiment: {
    currentSentiment: number
    sentimentChange24h: number
    socialVolume24h: number
    socialVolumePctChange: number
    sources: Array<any>
    topInfluencers: Array<any>
  } | null
}

export default function SentimentOverview({ sentiment }: SentimentOverviewProps) {
  // Format sentiment as a percentage
  const formatSentiment = (score: number) => `${(score * 100).toFixed(0)}%`

  // Format change with +/- sign
  const formatChange = (change: number) => {
    const sign = change >= 0 ? "+" : ""
    return `${sign}${(change * 100).toFixed(1)}%`
  }

  // Determine sentiment class (for color coding)
  const getSentimentClass = (change: number) => {
    return change >= 0 ? "text-green-600" : "text-red-600"
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sentiment Score</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatSentiment(sentiment?.currentSentiment || 0)}</div>
          <p className="text-xs text-muted-foreground flex items-center">
            <span className={sentiment?.sentimentChange24h ? getSentimentClass(sentiment.sentimentChange24h) : ""}>
              {sentiment?.sentimentChange24h ? formatChange(sentiment.sentimentChange24h) : "0%"}
            </span>
            <span className="ml-1">from yesterday</span>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Social Volume</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{sentiment?.socialVolume24h?.toLocaleString() || 0}</div>
          <p className="text-xs text-muted-foreground flex items-center">
            <span
              className={sentiment?.socialVolumePctChange ? getSentimentClass(sentiment.socialVolumePctChange) : ""}
            >
              {sentiment?.socialVolumePctChange ? formatChange(sentiment.socialVolumePctChange) : "0%"}
            </span>
            <span className="ml-1">from yesterday</span>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Platforms</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{sentiment?.sources?.length || 0}</div>
          <p className="text-xs text-muted-foreground">Social platforms analyzed</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Key Influencers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{sentiment?.topInfluencers?.length || 0}</div>
          <p className="text-xs text-muted-foreground">Influential figures tracked</p>
        </CardContent>
      </Card>
    </>
  )
}
