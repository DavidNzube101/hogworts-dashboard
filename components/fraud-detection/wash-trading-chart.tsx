"use client"

import { useState, useEffect } from "react"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"

interface WashTradingDataPoint {
  timestamp: string
  reportedVolume: number
  realVolume: number
  washVolume: number
  washPercentage: number
}

export default function WashTradingChart() {
  const [data, setData] = useState<WashTradingDataPoint[]>([])
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
        setData(result.washTrading?.history || [])
      } catch (err) {
        console.error("Error fetching wash trading data:", err)
        setError("Failed to load wash trading data")
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
        reported: {
          label: "Reported Volume",
          color: "hsl(var(--chart-1))",
        },
        real: {
          label: "Real Volume",
          color: "hsl(var(--chart-2))",
        },
        wash: {
          label: "Wash Trading",
          color: "hsl(var(--chart-5))",
        },
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 40 }}>
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
          <YAxis yAxisId="left" orientation="left" tickFormatter={formatVolume} />
          <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend align="center" />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="reportedVolume"
            stroke="var(--color-reported)"
            fill="var(--color-reported)"
            fillOpacity={0.2}
            stackId="1"
            name="Reported Volume"
          />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="realVolume"
            stroke="var(--color-real)"
            fill="var(--color-real)"
            fillOpacity={0.4}
            stackId="2"
            name="Real Volume"
          />
          <Area
            yAxisId="right"
            type="monotone"
            dataKey="washPercentage"
            stroke="var(--color-wash)"
            fill="var(--color-wash)"
            fillOpacity={0.2}
            name="Wash Trading %"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
