"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, AlertCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

interface AnomalyAlert {
  timestamp: string
  volumeChange: number
  priceChange: number
  severity: "low" | "medium" | "high"
}

export default function RecentFraudAlerts() {
  const [anomalies, setAnomalies] = useState<AnomalyAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAnomalies() {
      try {
        const response = await fetch("/api/fraud-metrics")

        if (!response.ok) {
          throw new Error("Failed to fetch anomalies")
        }

        const data = await response.json()
        setAnomalies(data.anomalies || [])
      } catch (err) {
        setError("Error loading anomaly data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchAnomalies()
  }, [])

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          Recent Fraud Alerts
        </CardTitle>
        <CardDescription>Unusual activity detected in the Solana ecosystem</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : error ? (
          <div className="p-4 rounded-lg bg-red-50 text-red-700">{error}</div>
        ) : anomalies.length === 0 ? (
          <div className="py-8 text-center">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <p className="text-muted-foreground">No anomalies detected recently</p>
          </div>
        ) : (
          <div className="space-y-4">
            {anomalies.map((anomaly, index) => (
              <div key={index} className="rounded-lg border p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">Volume Spike Detected</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(anomaly.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge variant={anomaly.severity === "high" ? "destructive" : "outline"}>{anomaly.severity}</Badge>
                </div>
                <div className="mt-2 text-sm">
                  <div>
                    Volume change:{" "}
                    <span className="font-medium text-amber-600">+{anomaly.volumeChange.toFixed(1)}%</span>
                  </div>
                  <div>
                    Price change: <span className="font-medium">{anomaly.priceChange.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/fraud-detection">
            View full analysis
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
