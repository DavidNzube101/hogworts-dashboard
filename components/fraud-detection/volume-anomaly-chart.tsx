"use client"

import { useState, useEffect } from "react"
import { Line, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend, ComposedChart } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"

interface TimeSeriesDataPoint {
  timestamp: string
  volume: number
  price: number
  volumeZ: number
  priceChange: number
  isAnomaly: boolean
}

export default function VolumeAnomalyChart() {
  const [data, setData] = useState<TimeSeriesDataPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/fraud-metrics")

        if (!response.ok) {
          throw new Error("Failed to fetch fraud metrics")
        }

        const result = await response.json()
        setData(result.timeSeriesData || [])
      } catch (err) {
        console.error("Error fetching volume anomaly data:", err)
        setError("Failed to load volume anomaly data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <Skeleton className="h-full w-full" />
  }

  if (error) {
    return <div className="h-full w-full flex items-center justify-center text-red-500">{error}</div>
  }

  // Format volume for display
  const formatVolume = (value: number) => {
    if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    return `$${(value / 1000).toFixed(1)}K`
  }

  return (
    <ChartContainer
      config={{
        volume: {
          label: "Volume",
          color: "hsl(var(--chart-1))",
        },
        price: {
          label: "Price",
          color: "hsl(var(--chart-2))",
        },
        zScore: {
          label: "Volume Z-Score",
          color: "hsl(var(--chart-3))",
        },
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(value) => {
              const date = new Date(value)
              return `${date.getMonth() + 1}/${date.getDate()}`
            }}
            angle={-45}
            textAnchor="end"
            height={70}
          />
          <YAxis yAxisId="left" orientation="left" stroke="var(--color-volume)" tickFormatter={formatVolume} />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="var(--color-price)"
            domain={["auto", "auto"]}
            tickFormatter={(value) => `$${value.toFixed(0)}`}
          />
          <YAxis
            yAxisId="z-score"
            orientation="right"
            stroke="var(--color-zScore)"
            domain={[0, "dataMax + 1"]}
            tickCount={5}
            hide
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend align="center" />
          <Bar
            yAxisId="left"
            dataKey="volume"
            fill="var(--color-volume)"
            barSize={20}
            opacity={0.8}
            name="Trading Volume"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="price"
            stroke="var(--color-price)"
            dot={false}
            strokeWidth={2}
            name="Price"
          />
          <Line
            yAxisId="z-score"
            type="monotone"
            dataKey="volumeZ"
            stroke="var(--color-zScore)"
            strokeDasharray="5 5"
            dot={false}
            strokeWidth={1}
            name="Volume Z-Score"
          />
          {/* Mark anomalies with dots */}
          {data
            .filter((d) => d.isAnomaly)
            .map((point, index) => (
              <Line
                key={index}
                yAxisId="right"
                data={[point]}
                dataKey="price"
                stroke="red"
                dot={{
                  r: 6,
                  fill: "red",
                  strokeWidth: 2,
                  stroke: "white",
                }}
                activeDot={false}
                legendType="none"
              />
            ))}
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
