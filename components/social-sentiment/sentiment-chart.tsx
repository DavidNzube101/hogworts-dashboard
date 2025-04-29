"use client"

import { Area, Bar, ComposedChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface SentimentHistoryProps {
  history: Array<{
    timestamp: string
    sentiment: number
    volume: number
  }>
}

export default function SentimentChart({ history }: SentimentHistoryProps) {
  return (
    <ChartContainer
      config={{
        sentiment: {
          label: "Sentiment",
          color: "hsl(var(--chart-1))",
        },
        volume: {
          label: "Social Volume",
          color: "hsl(var(--chart-2))",
        },
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={history} margin={{ top: 10, right: 30, left: 20, bottom: 40 }}>
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
          <YAxis
            yAxisId="left"
            orientation="left"
            domain={[0, 1]}
            tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
            stroke="var(--color-sentiment)"
          />
          <YAxis yAxisId="right" orientation="right" domain={[0, "auto"]} stroke="var(--color-volume)" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend align="center" />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="sentiment"
            stroke="var(--color-sentiment)"
            fill="var(--color-sentiment)"
            fillOpacity={0.2}
            activeDot={{ r: 6 }}
            name="Sentiment Score"
          />
          <Bar
            yAxisId="right"
            dataKey="volume"
            fill="var(--color-volume)"
            barSize={10}
            opacity={0.4}
            name="Social Volume"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
