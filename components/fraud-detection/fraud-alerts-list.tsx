import { AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface AnomalyAlert {
  timestamp: string
  volumeChange?: number
  priceChange: number
  severity: "low" | "medium" | "high"
  volumeZ?: number
}

interface FraudAlertsListProps {
  anomalies: AnomalyAlert[]
}

export default function FraudAlertsList({ anomalies }: FraudAlertsListProps) {
  if (anomalies.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">No anomalies detected</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {anomalies.map((anomaly, index) => (
        <div key={index} className="rounded-lg border p-3">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-medium flex items-center gap-1">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Volume Anomaly
              </div>
              <div className="text-sm text-muted-foreground">{new Date(anomaly.timestamp).toLocaleDateString()}</div>
            </div>
            <Badge variant={anomaly.severity === "high" ? "destructive" : "outline"}>{anomaly.severity}</Badge>
          </div>
          <div className="mt-2 text-sm">
            {anomaly.volumeChange && (
              <div>
                Volume change: <span className="font-medium text-amber-600">+{anomaly.volumeChange.toFixed(1)}%</span>
              </div>
            )}
            {anomaly.volumeZ && (
              <div>
                Volume Z-score: <span className="font-medium text-amber-600">{anomaly.volumeZ.toFixed(2)}</span>
              </div>
            )}
            <div>
              Price change: <span className="font-medium">{anomaly.priceChange.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
