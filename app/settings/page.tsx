import type { Metadata } from "next"

import AppSidebar from "@/components/app-sidebar"
import SettingsForm from "@/components/settings/settings-form"

export const metadata: Metadata = {
  title: "Settings | Hogwarts - Where Magic Meets Data",
  description: "Configure your magical analysis platform settings",
}

export default function SettingsPage() {
  return (
    <div className="flex">
      <AppSidebar />
      <div className="flex-1 p-4 md:p-8 md:ml-64 space-y-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Magical Settings</h1>
          <p className="text-muted-foreground">Configure your magical analysis platform settings</p>
        </div>

        <SettingsForm />
      </div>
    </div>
  )
}
