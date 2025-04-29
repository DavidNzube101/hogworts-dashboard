"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, Zap, Activity } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

import VolumeAnomalyChart from "./volume-anomaly-chart"
import WashTradingChart from "./wash-trading-chart"
import FraudAlertsList from "./fraud-alerts-list"
import FraudMetricsOverview from "./fraud-metrics-overview"

interface FraudData {
  metrics: {
    tokenPrice: number
    marketCap: number
    volume24h: number
    realVolume24h: number
  }
  anomalies: Array<{
    timestamp: string
    volumeChange: number
    priceChange: number
    severity: "low" | "medium" | "high"
    volumeZ: number
  }>
  washTrading: {
    current: {
      reportedVolume: number
      realVolume: number
      washTradingVolume: number
      washTradingPercentage: number
    }
    history: Array<{
      timestamp: string
      reportedVolume: number
      realVolume: number
      washVolume: number
      washPercentage: number
    }>
  }
}

export default function FraudDetectionDashboard() {
  const [fraudData, setFraudData] = useState<FraudData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchFraudData() {
      try {
        const response = await fetch("/api/fraud-metrics")

        if (!response.ok) {
          throw new Error("Failed to fetch fraud metrics")
        }

        const data = await response.json()
        setFraudData(data)
      } catch (err) {
        setError("Error loading fraud detection data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchFraudData()
  }, [])

  return (
    <div className="space-y-6">
      {!loading && fraudData?.anomalies.length ? (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Anomalies Detected</AlertTitle>
          <AlertDescription>
            We have detected {fraudData.anomalies.length} potential anomalies in the Solana ecosystem. Review the
            details below.
          </AlertDescription>
        </Alert>
      ) : null}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="anomalies">Volume Anomalies</TabsTrigger>
          <TabsTrigger value="wash-trading">Wash Trading</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {loading ? (
              <>
                <Skeleton className="h-[140px]" />
                <Skeleton className="h-[140px]" />
                <Skeleton className="h-[140px]" />
                <Skeleton className="h-[140px]" />
              </>
            ) : (
              <FraudMetricsOverview fraudData={fraudData} />
            )}
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-red-500" />
                  Volume Anomaly Detection
                </CardTitle>
                <CardDescription>
                  Analysis of volume vs price movement to detect potential market manipulation
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  <div className="h-[300px]">
                    <VolumeAnomalyChart />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Recent Anomalies
                </CardTitle>
                <CardDescription>Unusual trading patterns detected</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ) : (
                  <FraudAlertsList anomalies={fraudData?.anomalies || []} />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-500" />
                  Wash Trading Analysis
                </CardTitle>
                <CardDescription>Estimation of wash trading volume</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[200px] w-full" />
                ) : (
                  <div className="space-y-4">
                    <div>
                      <div className="text-2xl font-bold">
                        {fraudData?.washTrading.current.washTradingPercentage.toFixed(1)}%
                      </div>
                      <p className="text-sm text-muted-foreground">Estimated wash trading volume</p>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="grid grid-cols-2 text-sm">
                        <div className="text-muted-foreground">Reported 24h Vol</div>
                        <div className="text-right font-medium">
                          ${(fraudData?.metrics.volume24h || 0).toLocaleString()}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 text-sm">
                        <div className="text-muted-foreground">Real 24h Vol</div>
                        <div className="text-right font-medium">
                          ${(fraudData?.metrics.realVolume24h || 0).toLocaleString()}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 text-sm">
                        <div className="text-muted-foreground">Difference</div>
                        <div className="text-right font-medium text-red-600">
                          $
                          {(
                            (fraudData?.metrics.volume24h || 0) - (fraudData?.metrics.realVolume24h || 0)
                          ).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="anomalies">
          <Card>
            <CardHeader>
              <CardTitle>Volume Anomalies Analysis</CardTitle>
              <CardDescription>Detailed view of potential market manipulation through volume anomalies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="h-[400px]">
                  <VolumeAnomalyChart />
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">How We Detect Anomalies</h3>
                  <p className="text-sm text-muted-foreground">
                    Our algorithm calculates a Z-score for trading volume by comparing each day's volume to a 7-day
                    rolling average. A Z-score above 2 (meaning volume is 2 standard deviations above normal) combined
                    with minimal price movement (less than 3%) may indicate artificial volume inflation or other market
                    manipulation.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Detected Anomalies</h3>
                  <FraudAlertsList anomalies={fraudData?.anomalies || []} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wash-trading">
          <Card>
            <CardHeader>
              <CardTitle>Wash Trading Detection</CardTitle>
              <CardDescription>Analysis of potential wash trading activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="h-[400px]">
                  <WashTradingChart />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">What is Wash Trading?</h3>
                    <p className="text-sm text-muted-foreground">
                      Wash trading occurs when the same entity is both the buyer and seller in a transaction, creating
                      artificial volume without changing ownership. This practice is used to manipulate markets by
                      creating a false impression of activity and liquidity.
                    </p>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">How We Detect It</h3>
                    <p className="text-sm text-muted-foreground">
                      We compare reported trading volume with "real" volume (estimated by Messari) to identify potential
                      wash trading. The difference between these figures gives us an estimate of artificial volume in
                      the market.
                    </p>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Current Wash Trading Metrics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-3xl font-bold">
                        {fraudData?.washTrading.current.washTradingPercentage.toFixed(1)}%
                      </div>
                      <p className="text-sm text-muted-foreground">Estimated wash trading percentage</p>
                    </div>

                    <div>
                      <div className="text-3xl font-bold">
                        ${((fraudData?.washTrading.current.washTradingVolume || 0) / 1000000).toFixed(2)}M
                      </div>
                      <p className="text-sm text-muted-foreground">Estimated wash trading volume (24h)</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
