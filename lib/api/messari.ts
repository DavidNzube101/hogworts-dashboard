const MESSARI_API_BASE_URL = "https://data.messari.io/api/v1"

type MessariApiOptions = {
  endpoint: string
  params?: Record<string, string>
}

export async function fetchMessariApi({ endpoint, params = {} }: MessariApiOptions) {
  const apiKey = process.env.MESSARI_API_KEY

  if (!apiKey) {
    console.warn("MESSARI_API_KEY is not set. API calls may be rate limited.")
  }

  const queryParams = new URLSearchParams(params)
  const url = `${MESSARI_API_BASE_URL}${endpoint}?${queryParams}`

  try {
    const response = await fetch(url, {
      headers: {
        "x-messari-api-key": apiKey || "",
      },
      next: { revalidate: 60 * 10 }, // Cache for 10 minutes
    })

    if (!response.ok) {
      throw new Error(`Messari API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching from Messari API:", error)
    throw error
  }
}

export async function fetchAssetMetrics(assetSymbol: string) {
  return fetchMessariApi({
    endpoint: `/assets/${assetSymbol}/metrics`,
  })
}

export async function fetchAssetTimeSeries(assetSymbol: string, metric: string, timeframe = "1d", days = 30) {
  const now = new Date()
  const end = Math.floor(now.getTime() / 1000)
  const start = Math.floor(new Date(now.setDate(now.getDate() - days)).getTime() / 1000)

  return fetchMessariApi({
    endpoint: `/assets/${assetSymbol}/metrics/${metric}/time-series`,
    params: {
      interval: timeframe,
      start: start.toString(),
      end: end.toString(),
    },
  })
}

export async function fetchNews(topic = "solana", limit = 20) {
  return fetchMessariApi({
    endpoint: "/news",
    params: {
      topics: topic,
      limit: limit.toString(),
    },
  })
}

export async function fetchAssets(limit = 20) {
  return fetchMessariApi({
    endpoint: "/assets",
    params: {
      limit: limit.toString(),
      fields: "id,slug,symbol,metrics/market_data,metrics/marketcap",
    },
  })
}

// Enhanced fraud detection utilities

export async function analyzeVolumeAnomalies(assetSymbol: string, days = 30) {
  try {
    // Fetch volume and price data
    const volumeData = await fetchAssetTimeSeries(assetSymbol, "volume", "1d", days)
    const priceData = await fetchAssetTimeSeries(assetSymbol, "price", "1d", days)

    // Extract time series data
    const volumeTimeSeries = volumeData.data.values
    const priceTimeSeries = priceData.data.values

    // Create a map of timestamps to price data for easier lookup
    const priceMap = new Map<number, number>(priceTimeSeries.map(([timestamp, price]: [number, number]) => [timestamp, price]))

    // Calculate rolling averages and standard deviations for volume
    const windowSize = 7 // 7-day rolling window
    const anomalies = []
    const combinedData = []

    for (let i = 0; i < volumeTimeSeries.length; i++) {
      const [timestamp, volume] = volumeTimeSeries[i]
      const price = priceMap.get(timestamp) || 0

      // Skip if we don't have enough data for the rolling window
      if (i < windowSize) {
        combinedData.push({
          timestamp,
          volume,
          price,
          volumeZ: 0,
          priceChange: 0,
          isAnomaly: false,
        })
        continue
      }

      // Calculate rolling window statistics
      const windowVolumes = volumeTimeSeries.slice(i - windowSize, i).map(([, vol]: [number, number]) => vol)
      const avgVolume = windowVolumes.reduce((sum: number, vol: number) => sum + vol, 0) / windowSize
      const stdDevVolume = Math.sqrt(
        windowVolumes.reduce((sum: number, vol: number) => sum + Math.pow(vol - avgVolume, 2), 0) / windowSize,
      )

      // Calculate price change percentage
      const prevDayData = volumeTimeSeries[i - 1]
      const prevDayPrice = priceMap.get(prevDayData[0]) || 0
      const priceChange = prevDayPrice > 0 ? (price - prevDayPrice) / prevDayPrice : 0

      // Calculate Z-score for volume
      const volumeZ = stdDevVolume > 0 ? (volume - avgVolume) / stdDevVolume : 0

      // Define anomaly criteria:
      // 1. Volume Z-score > 2 (volume is 2 standard deviations above the rolling average)
      // 2. Price change is minimal (less than 3%)
      const isAnomaly = volumeZ > 2 && Math.abs(priceChange) < 0.03

      if (isAnomaly) {
        anomalies.push({
          timestamp: new Date(timestamp * 1000).toISOString(),
          volume,
          price,
          volumeZ,
          volumeChange: volume / avgVolume - 1, // Percentage increase over average
          priceChange,
          severity: volumeZ > 3 ? "high" : volumeZ > 2.5 ? "medium" : "low",
        })
      }

      combinedData.push({
        timestamp: new Date(timestamp * 1000).toISOString().split("T")[0],
        volume,
        price,
        volumeZ,
        priceChange,
        isAnomaly,
      })
    }

    return {
      anomalies,
      timeSeriesData: combinedData,
    }
  } catch (error) {
    console.error("Error analyzing volume anomalies:", error)
    throw error
  }
}

export async function detectWashTrading(assetSymbol: string) {
  try {
    // Fetch metrics data which includes reported volume and "real" volume
    const metricsData = await fetchAssetMetrics(assetSymbol)

    const reportedVolume = metricsData.data.market_data.volume_last_24_hours || 0
    const realVolume = metricsData.data.market_data.real_volume_last_24_hours || 0

    // Calculate wash trading percentage
    const washTradingVolume = Math.max(0, reportedVolume - realVolume)
    const washTradingPercentage = reportedVolume > 0 ? (washTradingVolume / reportedVolume) * 100 : 0

    // Get historical volume data for trend analysis
    const volumeHistory = await fetchAssetTimeSeries(assetSymbol, "volume", "1d", 30)
    const realVolumeHistory = await fetchAssetTimeSeries(assetSymbol, "real_volume", "1d", 30)

    // Process historical data
    const volumeTimeSeries = volumeHistory.data.values
    const realVolumeMap = new Map(
      realVolumeHistory.data.values.map(([timestamp, volume]: [number, number]) => [timestamp, volume]),
    )

    const washTradingHistory = volumeTimeSeries.map(([timestamp, volume]: [number, number]) => {
      const realVol = (realVolumeMap.get(timestamp) ?? volume) as number // Default to reported volume if real not available
      const washVol = Math.max(0, volume - realVol)
      const washPct = volume > 0 ? (washVol / volume) * 100 : 0

      return {
        timestamp: new Date(timestamp * 1000).toISOString().split("T")[0],
        reportedVolume: volume,
        realVolume: realVol,
        washVolume: washVol,
        washPercentage: washPct,
      }
    })

    return {
      current: {
        reportedVolume,
        realVolume,
        washTradingVolume,
        washTradingPercentage,
      },
      history: washTradingHistory,
    }
  } catch (error) {
    console.error("Error detecting wash trading:", error)
    throw error
  }
}

export async function analyzeSocialSentiment(assetSymbol: string) {
  // Note: This is a placeholder for future integration with Messari's social data
  // Currently, Messari's free API doesn't provide comprehensive social sentiment data
  // We'll use Twitter metrics as a proxy for now
  try {
    const metricsData = await fetchAssetMetrics(assetSymbol)

    // Extract Twitter metrics
    const twitterFollowers = metricsData.data.twitter?.followers || 0
    const twitterFollowersChange = metricsData.data.twitter?.followers_change_24h || 0
    const twitterStatus = metricsData.data.twitter?.status_count || 0

    // Calculate a simple sentiment score based on follower growth
    // This is a very simplified approach - real sentiment analysis would be more sophisticated
    const followerGrowthRate = twitterFollowers > 0 ? twitterFollowersChange / twitterFollowers : 0
    const sentimentScore = 0.5 + followerGrowthRate * 10 // Normalize to 0-1 range with 0.5 as neutral

    return {
      twitterMetrics: {
        followers: twitterFollowers,
        followersChange24h: twitterFollowersChange,
        statusCount: twitterStatus,
        followerGrowthRate,
      },
      sentimentScore: Math.max(0, Math.min(1, sentimentScore)), // Clamp between 0 and 1
      sentimentChange24h: followerGrowthRate * 0.5, // Simplified change calculation
    }
  } catch (error) {
    console.error("Error analyzing social sentiment:", error)
    throw error
  }
}
