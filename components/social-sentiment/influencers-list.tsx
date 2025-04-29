import { TrendingUp, TrendingDown } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface InfluencersListProps {
  influencers: Array<{
    name: string
    platform: string
    handle: string
    sentiment: number
    recentPost: string
    influence: number
  }>
}

export default function InfluencersList({ influencers }: InfluencersListProps) {
  // Format sentiment as a percentage
  const formatSentiment = (score: number) => `${(score * 100).toFixed(0)}%`

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  // Get sentiment indicator
  const getSentimentIndicator = (score: number) => {
    if (score >= 0.7) {
      return <TrendingUp className="h-4 w-4 text-green-600" />
    }
    if (score <= 0.4) {
      return <TrendingDown className="h-4 w-4 text-red-600" />
    }
    return null
  }

  return (
    <div className="space-y-4">
      {influencers.map((influencer, index) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarFallback>{getInitials(influencer.name)}</AvatarFallback>
                </Avatar>
                {influencer.name}
              </div>
              <Badge variant="outline">{influencer.platform}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              <div className="text-sm text-muted-foreground">{influencer.handle}</div>

              <div className="flex justify-between items-center">
                <div className="text-sm">
                  <span className="text-muted-foreground mr-2">Sentiment:</span>
                  <span className="font-medium flex items-center gap-1">
                    {formatSentiment(influencer.sentiment)}
                    {getSentimentIndicator(influencer.sentiment)}
                  </span>
                </div>

                <div className="text-sm">
                  <span className="text-muted-foreground mr-2">Influence Score:</span>
                  <span className="font-medium">{influencer.influence}/100</span>
                </div>
              </div>

              <div className="border-t pt-2 mt-1">
                <div className="text-sm text-muted-foreground mb-1">Recent Post:</div>
                <div className="text-sm italic">"{influencer.recentPost}"</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
