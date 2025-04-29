"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, DollarSign, BarChart3 } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface MetricsData {
  tokenPrice: number
  marketCap: number
  volume24h: number
  realVolume24h: number
  anomalies: Array<any>
}

export default function OverviewMetrics() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const response = await fetch("/api/fraud-metrics")

        if (!response.ok) {
          throw new Error("Failed to fetch metrics")
        }

        const data = await response.json()
        setMetrics(data)
      } catch (err) {
        setError("Error loading metrics data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-700">
        <AlertTriangle className="h-5 w-5 inline mr-2" />
        {error}
      </div>
    )
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">SOL Price</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-[100px]" />
          ) : (
            <>
              <div className="text-2xl font-bold">${metrics?.tokenPrice.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">+0.9% from yesterday</p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Market Cap</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-[100px]" />
          ) : (
            <>
              <div className="text-2xl font-bold">${((metrics?.marketCap || 0) / 1000000000).toFixed(2)}B</div>
              <p className="text-xs text-muted-foreground">Rank #6 by market cap</p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-[100px]" />
          ) : (
            <>
              <div className="text-2xl font-bold">${((metrics?.volume24h || 0) / 1000000).toFixed(2)}M</div>
              <p className="text-xs text-muted-foreground">+12.5% from yesterday</p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Anomaly Score</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-[100px]" />
          ) : (
            <>
              <div className="text-2xl font-bold">{metrics?.anomalies.length ? metrics.anomalies.length * 17 : 0}</div>
              <p className="text-xs text-muted-foreground">
                {metrics?.anomalies.length ? `${metrics.anomalies.length} anomalies detected` : "No anomalies detected"}
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
