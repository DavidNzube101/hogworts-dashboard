import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { MobileMenuProvider } from "@/components/mobile-menu-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Hogwarts - Where Magic Meets Data",
  description: "Discover magical insights and analytics within the wizarding world of data",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} w-full`}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="dark" 
          enableSystem 
          themes={["light", "dark", "hogwarts", "slytherin", "gryffindor"]}
          disableTransitionOnChange
        >
          <MobileMenuProvider>
            <SidebarProvider>
              <main className="min-h-screen w-full bg-background">{children}</main>
              <Toaster position="top-right" richColors />
            </SidebarProvider>
          </MobileMenuProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}