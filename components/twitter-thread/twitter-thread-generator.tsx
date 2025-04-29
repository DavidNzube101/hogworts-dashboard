"use client"

import { useState, useEffect } from "react"
import { Copy, Download, RefreshCw, Twitter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

interface ThreadData {
  title: string
  tweets: string[]
}

export default function TwitterThreadGenerator() {
  const [loading, setLoading] = useState(true)
  const [threadData, setThreadData] = useState<ThreadData>({
    title: "Solana Analysis: Fraud Detection & Market Insights",
    tweets: [
      "🧵 1/6 Just analyzed #Solana's on-chain activity and found some interesting patterns. Here's what you need to know about the current state of $SOL:",
      "2/6 📊 Market Overview:\n- Price: $XX.XX\n- 24h Volume: $XXM\n- Market Cap: $XXB\n- Real Volume (excluding wash trading): ~XX% of reported volume",
      "3/6 🚨 Fraud Detection:\n- Identified X potential volume anomalies in the past 30 days\n- Wash trading estimated at XX% of total volume\n- Risk score: Medium",
      "4/6 📱 Social Sentiment:\n- Overall sentiment: Positive (XX%)\n- Twitter followers: XXk (+X% this week)\n- Most discussed topics: DeFi, NFTs, Mobile",
      "5/6 📰 Key News:\n- Solana Mobile announced new partnerships\n- DeFi TVL increased by XX% this month\n- New validator improvements coming next quarter",
      "6/6 🔮 Outlook:\n- Technical indicators suggest continued growth\n- Social sentiment remains strong despite market volatility\n- Watch for upcoming protocol upgrades\n\n#Crypto #Blockchain #SolanaAnalysis",
    ],
  })
  const [editableTweets, setEditableTweets] = useState<string[]>([])
  const [customTitle, setCustomTitle] = useState("")
  const [includeMetrics, setIncludeMetrics] = useState({
    price: true,
    volume: true,
    marketCap: true,
    washTrading: true,
    fraudDetection: true,
    socialSentiment: true,
    news: true,
  })

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setLoading(false)
      setEditableTweets([...threadData.tweets])
    }, 1500)
  }, [])

  const handleGenerateThread = async () => {
    setLoading(true)

    try {
      // In a real implementation, this would fetch data from our API endpoints
      // and generate a thread based on the latest data
      const [fraudResponse, sentimentResponse, newsResponse] = await Promise.all([
        fetch("/api/fraud-metrics"),
        fetch("/api/social-sentiment"),
        fetch("/api/news-feed"),
      ])

      const fraudData = await fraudResponse.json()
      const sentimentData = await sentimentResponse.json()
      const newsData = await newsResponse.json()

      // Generate thread based on fetched data
      const price = fraudData.metrics?.tokenPrice?.toFixed(2) || "XX.XX"
      const volume = (fraudData.metrics?.volume24h / 1000000)?.toFixed(0) || "XX"
      const marketCap = (fraudData.metrics?.marketCap / 1000000000)?.toFixed(1) || "XX"
      const washTradingPct =
        (
          ((fraudData.metrics?.volume24h - fraudData.metrics?.realVolume24h) / fraudData.metrics?.volume24h) *
          100
        )?.toFixed(0) || "XX"
      const anomalyCount = fraudData.anomalies?.length || "X"
      const sentimentPct = (sentimentData.currentSentiment * 100)?.toFixed(0) || "XX"
      const followers = (sentimentData.socialVolume24h / 1000)?.toFixed(1) || "XX"
      const followerChange = (sentimentData.socialVolumePctChange * 100)?.toFixed(1) || "X"

      // Get recent news headlines
      const recentNews = newsData.news?.slice(0, 3).map((item: any) => item.title.split(" - ")[0]) || [
        "Solana Mobile announced new partnerships",
        "DeFi TVL increased by XX% this month",
        "New validator improvements coming next quarter",
      ]

      // Create new thread
      const newThread = {
        title: customTitle || "Solana Analysis: Fraud Detection & Market Insights",
        tweets: [
          `🧵 1/6 Just analyzed #Solana's on-chain activity and found some interesting patterns. Here's what you need to know about the current state of $SOL:`,

          `2/6 📊 Market Overview:
- Price: $${price}
- 24h Volume: $${volume}M
- Market Cap: $${marketCap}B
- Real Volume (excluding wash trading): ~${100 - Number.parseInt(washTradingPct)}% of reported volume`,

          `3/6 🚨 Fraud Detection:
- Identified ${anomalyCount} potential volume anomalies in the past 30 days
- Wash trading estimated at ${washTradingPct}% of total volume
- Risk score: ${anomalyCount > 5 ? "High" : anomalyCount > 2 ? "Medium" : "Low"}`,

          `4/6 📱 Social Sentiment:
- Overall sentiment: ${Number.parseInt(sentimentPct) > 65 ? "Positive" : Number.parseInt(sentimentPct) > 45 ? "Neutral" : "Negative"} (${sentimentPct}%)
- Twitter followers: ${followers}k (${Number.parseFloat(followerChange) > 0 ? "+" : ""}${followerChange}% this week)
- Most discussed topics: DeFi, NFTs, Mobile`,

          `5/6 📰 Key News:
- ${recentNews[0]}
- ${recentNews[1]}
- ${recentNews[2]}`,

          `6/6 🔮 Outlook:
- Technical indicators suggest ${Number.parseInt(sentimentPct) > 60 ? "continued growth" : "cautious optimism"}
- Social sentiment remains ${Number.parseInt(sentimentPct) > 65 ? "strong" : "mixed"} despite market volatility
- Watch for upcoming protocol upgrades

#Crypto #Blockchain #SolanaAnalysis`,
        ],
      }

      setThreadData(newThread)
      setEditableTweets([...newThread.tweets])
    } catch (error) {
      console.error("Error generating thread:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCopyTweet = (tweet: string) => {
    navigator.clipboard.writeText(tweet)
    toast({
      title: "Copied to clipboard",
      description: "Tweet copied to clipboard successfully",
    })
  }

  const handleCopyAll = () => {
    navigator.clipboard.writeText(threadData.tweets.join("\n\n"))
    toast({
      title: "Copied to clipboard",
      description: "All tweets copied to clipboard successfully",
    })
  }

  const handleDownload = () => {
    const element = document.createElement("a")
    const file = new Blob([threadData.tweets.join("\n\n")], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = "solana-analysis-thread.txt"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleOpenTwitter = (tweet: string) => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`
    window.open(twitterUrl, "_blank")
  }

  const handleTweetChange = (index: number, value: string) => {
    const newTweets = [...editableTweets]
    newTweets[index] = value
    setEditableTweets(newTweets)
  }

  const handleSaveEdits = () => {
    setThreadData({
      ...threadData,
      tweets: [...editableTweets],
    })
    toast({
      title: "Changes saved",
      description: "Your edits have been saved successfully",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thread Settings</CardTitle>
          <CardDescription>Customize your Twitter thread content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="threadTitle">Thread Title (for your reference)</Label>
              <Input
                id="threadTitle"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder={threadData.title}
              />
            </div>

            <div>
              <Label>Include in Thread</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="price"
                    checked={includeMetrics.price}
                    onCheckedChange={(checked) => setIncludeMetrics({ ...includeMetrics, price: !!checked })}
                  />
                  <Label htmlFor="price">Price Data</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="volume"
                    checked={includeMetrics.volume}
                    onCheckedChange={(checked) => setIncludeMetrics({ ...includeMetrics, volume: !!checked })}
                  />
                  <Label htmlFor="volume">Volume Data</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="marketCap"
                    checked={includeMetrics.marketCap}
                    onCheckedChange={(checked) => setIncludeMetrics({ ...includeMetrics, marketCap: !!checked })}
                  />
                  <Label htmlFor="marketCap">Market Cap</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="washTrading"
                    checked={includeMetrics.washTrading}
                    onCheckedChange={(checked) => setIncludeMetrics({ ...includeMetrics, washTrading: !!checked })}
                  />
                  <Label htmlFor="washTrading">Wash Trading</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="fraudDetection"
                    checked={includeMetrics.fraudDetection}
                    onCheckedChange={(checked) => setIncludeMetrics({ ...includeMetrics, fraudDetection: !!checked })}
                  />
                  <Label htmlFor="fraudDetection">Fraud Detection</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="socialSentiment"
                    checked={includeMetrics.socialSentiment}
                    onCheckedChange={(checked) => setIncludeMetrics({ ...includeMetrics, socialSentiment: !!checked })}
                  />
                  <Label htmlFor="socialSentiment">Social Sentiment</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="news"
                    checked={includeMetrics.news}
                    onCheckedChange={(checked) => setIncludeMetrics({ ...includeMetrics, news: !!checked })}
                  />
                  <Label htmlFor="news">News</Label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleGenerateThread} disabled={loading}>
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Generate Thread
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Generated Thread</CardTitle>
          <CardDescription>Your Twitter thread based on the latest Solana analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <>
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </>
            ) : (
              <Tabs defaultValue="preview" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="edit">Edit</TabsTrigger>
                </TabsList>
                <TabsContent value="preview" className="space-y-4 mt-4">
                  {threadData.tweets.map((tweet, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium">Tweet {index + 1}</div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleCopyTweet(tweet)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleOpenTwitter(tweet)}>
                            <Twitter className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="whitespace-pre-line">{tweet}</div>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="edit" className="space-y-4 mt-4">
                  {editableTweets.map((tweet, index) => (
                    <div key={index} className="space-y-2">
                      <Label htmlFor={`tweet-${index}`}>Tweet {index + 1}</Label>
                      <Textarea
                        id={`tweet-${index}`}
                        value={tweet}
                        onChange={(e) => handleTweetChange(index, e.target.value)}
                        rows={5}
                      />
                    </div>
                  ))}
                  <Button onClick={handleSaveEdits}>Save Edits</Button>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            {threadData.tweets.length} tweets · {threadData.tweets.join("").length} characters
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCopyAll}>
              <Copy className="mr-2 h-4 w-4" />
              Copy All
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
