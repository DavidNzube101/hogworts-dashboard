import type { Metadata } from "next"

import AppSidebar from "@/components/app-sidebar"
import FraudDetectionDashboard from "@/components/fraud-detection/fraud-dashboard"

export const metadata: Metadata = {
  title: "Fraud Detection | Hogwarts - Where Magic Meets Data",
  description: "Detect and analyze potential fraudulent activities in the magical world",
}

export default function FraudDetectionPage() {
  return (
    <div className="flex">
      <AppSidebar />
      <div className="flex-1 p-4 md:p-8 md:ml-64 space-y-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Magical Anomalies</h1>
          <p className="text-muted-foreground">
            Detect and analyze potential fraudulent activities in the magical world
          </p>
        </div>

        <FraudDetectionDashboard />
      </div>
    </div>
  )
}
