import { NextResponse } from "next/server"
import { fetchAssetMetrics, analyzeVolumeAnomalies, detectWashTrading } from "@/lib/api/messari"

export async function GET() {
  try {
    // Fetch key metrics for SOL
    const metricsData = await fetchAssetMetrics("SOL")

    // Analyze volume anomalies
    const volumeAnomalyData = await analyzeVolumeAnomalies("SOL", 30)

    // Detect wash trading
    const washTradingData = await detectWashTrading("SOL")

    return NextResponse.json({
      metrics: {
        tokenPrice: metricsData.data.market_data.price_usd,
        marketCap: metricsData.data.marketcap.current_marketcap_usd,
        volume24h: metricsData.data.market_data.volume_last_24_hours,
        realVolume24h: metricsData.data.market_data.real_volume_last_24_hours,
      },
      anomalies: volumeAnomalyData.anomalies,
      timeSeriesData: volumeAnomalyData.timeSeriesData,
      washTrading: washTradingData,
    })
  } catch (error) {
    console.error("Error fetching fraud metrics:", error)
    return NextResponse.json({ error: "Failed to fetch fraud metrics" }, { status: 500 })
  }
}
