import type { Metadata } from "next"

import AppSidebar from "@/components/app-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Analytics | Hogwarts - Where Magic Meets Data",
  description: "Advanced analytics and insights for the wizarding world",
}

export default function AnalyticsPage() {
  return (
    <div className="flex">
      <AppSidebar />
      <div className="flex-1 p-4 md:p-8 md:ml-64 space-y-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Magical Analytics</h1>
          <p className="text-muted-foreground">Advanced analytics and insights for the wizarding world</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Spell Usage Analytics</CardTitle>
              <CardDescription>Track the most popular spells and their effectiveness</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-muted/50 rounded-md">
                <p className="text-muted-foreground">Spell analytics visualization will appear here</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Potion Brewing Success Rate</CardTitle>
              <CardDescription>Monitor potion brewing outcomes and ingredient effectiveness</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-muted/50 rounded-md">
                <p className="text-muted-foreground">Potion analytics visualization will appear here</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
