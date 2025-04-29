import { AlertTriangle, BarChart3, Zap } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FraudMetricsOverviewProps {
  fraudData: {
    metrics: {
      tokenPrice: number
      marketCap: number
      volume24h: number
      realVolume24h: number
    }
    anomalies: Array<any>
    washTrading: {
      current: {
        washTradingPercentage: number
      }
    }
  } | null
}

export default function FraudMetricsOverview({ fraudData }: FraudMetricsOverviewProps) {
  // Calculate the anomaly score - this is just a simplified example
  // In a real app, this would be based on more sophisticated heuristics
  const calculateAnomalyScore = () => {
    if (!fraudData) return 0

    // Simple score based on number of anomalies and their severity
    const baseScore = fraudData.anomalies.length * 10
    const severityBonus = fraudData.anomalies.reduce((acc, anomaly) => {
      if (anomaly.severity === "high") return acc + 15
      if (anomaly.severity === "medium") return acc + 10
      return acc + 5
    }, 0)

    return Math.min(100, baseScore + severityBonus)
  }

  // Get the risk level based on the anomaly score
  const getRiskLevel = (score: number) => {
    if (score >= 70) return "High"
    if (score >= 30) return "Medium"
    return "Low"
  }

  // Get the color class based on the risk level
  const getRiskColorClass = (score: number) => {
    if (score >= 70) return "text-red-600"
    if (score >= 30) return "text-amber-600"
    return "text-green-600"
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{calculateAnomalyScore()}</div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <span className={getRiskColorClass(calculateAnomalyScore())}>{getRiskLevel(calculateAnomalyScore())}</span>{" "}
            risk level
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Wash Trading</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{fraudData?.washTrading.current.washTradingPercentage.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">of reported volume</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Reported Volume</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${(fraudData?.metrics.volume24h || 0).toLocaleString("en-US", { maximumFractionDigits: 0 })}
          </div>
          <p className="text-xs text-muted-foreground">24h trading volume</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Real Volume</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${(fraudData?.metrics.realVolume24h || 0).toLocaleString("en-US", { maximumFractionDigits: 0 })}
          </div>
          <p className="text-xs text-muted-foreground">Estimated real trading volume</p>
        </CardContent>
      </Card>
    </>
  )
}
