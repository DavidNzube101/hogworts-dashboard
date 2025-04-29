"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PlatformBreakdownProps {
  sources: Array<{
    source: string
    sentiment: number
    volume: number
    change: number
  }>
}

export default function PlatformBreakdown({ sources }: PlatformBreakdownProps) {
  // Use different colors for each platform
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A259FF", "#FF6B6B"]

  // Format sentiment as a percentage
  const formatSentiment = (score: number) => `${(score * 100).toFixed(0)}%`

  // Format change with +/- sign
  const formatChange = (change: number) => {
    const sign = change >= 0 ? "+" : ""
    return `${sign}${(change * 100).toFixed(1)}%`
  }

  // Determine sentiment class (for color coding)
  const getSentimentClass = (change: number) => {
    return change >= 0 ? "text-green-600" : "text-red-600"
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-3">Volume Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sources}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="volume"
                  nameKey="source"
                >
                  {sources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => [value.toLocaleString(), name]}
                  labelFormatter={(value) => "Volume"}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-3">Sentiment By Platform</h3>
          <div className="h-64">
            <ChartContainer
              config={{
                sentiment: {
                  label: "Sentiment",
                  color: "hsl(var(--chart-1))",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sources} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="source" />
                  <YAxis domain={[0, 1]} tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="sentiment" fill="var(--color-sentiment)" name="Sentiment Score">
                    {sources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Platform Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sources.map((source, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{source.source}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Sentiment</div>
                  <div className="font-medium">{formatSentiment(source.sentiment)}</div>

                  <div className="text-muted-foreground">Volume</div>
                  <div className="font-medium">{source.volume.toLocaleString()}</div>

                  <div className="text-muted-foreground">24h Change</div>
                  <div className={`font-medium ${getSentimentClass(source.change)}`}>{formatChange(source.change)}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
