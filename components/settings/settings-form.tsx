"use client"

import type React from "react"

import { useState } from "react"
import { CheckCircle2, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function SettingsForm() {
  const [apiKeySaved, setApiKeySaved] = useState(false)
  const [apiKeyError, setApiKeyError] = useState(false)

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate API key validation
    const apiKey = (e.currentTarget as HTMLFormElement).apiKey.value

    if (apiKey && apiKey.length > 10) {
      setApiKeySaved(true)
      setApiKeyError(false)
    } else {
      setApiKeyError(true)
      setApiKeySaved(false)
    }
  }

  return (
    <Tabs defaultValue="api" className="max-w-3xl">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="api">API Integration</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="display">Display</TabsTrigger>
      </TabsList>

      <TabsContent value="api" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>Configure your API keys for data providers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSaveApiKey}>
              <div className="space-y-2">
                <Label htmlFor="apiKey">Messari API Key</Label>
                <div className="flex gap-2">
                  <Input id="apiKey" name="apiKey" type="password" placeholder="Enter your Messari API key" />
                  <Button type="submit">Save</Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  You can get an API key from the{" "}
                  <a href="https://messari.io/api" target="_blank" rel="noreferrer noopener" className="underline">
                    Messari API portal
                  </a>
                </p>

                {apiKeySaved && (
                  <Alert className="mt-2 bg-green-50 text-green-700 border-green-200">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>Your API key has been saved</AlertDescription>
                  </Alert>
                )}

                {apiKeyError && (
                  <Alert className="mt-2 bg-red-50 text-red-700 border-red-200">
                    <XCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>Please enter a valid API key</AlertDescription>
                  </Alert>
                )}
              </div>
            </form>

            <div className="space-y-2">
              <Label htmlFor="heliusKey">Helius API Key (Optional)</Label>
              <div className="flex gap-2">
                <Input id="heliusKey" type="password" placeholder="Enter your Helius API key" />
                <Button variant="outline">Save</Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Helius enhances on-chain data for Solana. Get an API key from the{" "}
                <a href="https://www.helius.xyz/" target="_blank" rel="noreferrer noopener" className="underline">
                  Helius developer portal
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Sync Settings</CardTitle>
            <CardDescription>Configure how often the application syncs data from APIs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="syncInterval">Data Sync Interval</Label>
                <select id="syncInterval" aria-label="Sync Interval" className="w-full p-2 rounded-md border">
                  <option value="5">Every 5 minutes</option>
                  <option value="15">Every 15 minutes</option>
                  <option value="30">Every 30 minutes</option>
                  <option value="60">Every hour</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxDataAge">Max Data Age</Label>
                <select id="maxDataAge"  aria-label="Max Data Age" className="w-full p-2 rounded-md border">
                  <option value="1">1 day</option>
                  <option value="7">7 days</option>
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="enableCaching" />
              <Label htmlFor="enableCaching">Enable data caching</Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Settings</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="notifications" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Configure how you want to be notified about important events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="fraudAlerts">Fraud Alerts</Label>
                <p className="text-sm text-muted-foreground">Receive notifications when new fraud is detected</p>
              </div>
              <Switch id="fraudAlerts" />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sentimentChanges">Sentiment Changes</Label>
                <p className="text-sm text-muted-foreground">Notify when sentiment changes significantly</p>
              </div>
              <Switch id="sentimentChanges" />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dailyDigest">Daily Digest</Label>
                <p className="text-sm text-muted-foreground">Receive a daily summary of all activity</p>
              </div>
              <Switch id="dailyDigest" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Notification Settings</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="display" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Display Settings</CardTitle>
            <CardDescription>Customize how the application looks and feels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <select id="theme" aria-label="Theme" className="w-full p-2 rounded-md border">
                <option value="system">System Default</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="chartStyle">Chart Style</Label>
              <select id="chartStyle" aria-label="Chart Style" className="w-full p-2 rounded-md border">
                <option value="default">Default</option>
                <option value="modern">Modern</option>
                <option value="classic">Classic</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Dashboard Widgets</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="showFraudMetrics" defaultChecked />
                  <Label htmlFor="showFraudMetrics">Show Fraud Metrics</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="showSentiment" defaultChecked />
                  <Label htmlFor="showSentiment">Show Social Sentiment</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="showNews" defaultChecked />
                  <Label htmlFor="showNews">Show News Feed</Label>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Display Settings</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
