"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes"


export function ThemeProvider({ 
  children, 
  themes = ["light", "dark"],
  ...props 
}: ThemeProviderProps & { themes?: string[] }) {
  return (
    <>
      {/* Add CSS variables for custom themes */}
      <style jsx global>{`
        :root[data-theme="hogwarts"] {
          --background: 240 5% 10%;
          --foreground: 0 0% 98%;
          --card: 240 5% 15%;
          --card-foreground: 0 0% 98%;
          --popover: 240 5% 15%;
          --popover-foreground: 0 0% 98%;
          --primary: 266 100% 50%;
          --primary-foreground: 0 0% 98%;
          --secondary: 240 5% 20%;
          --secondary-foreground: 0 0% 98%;
          --muted: 240 5% 20%;
          --muted-foreground: 240 5% 65%;
          --accent: 266 100% 50%;
          --accent-foreground: 0 0% 98%;
          --destructive: 0 75% 50%;
          --destructive-foreground: 0 0% 98%;
          --border: 240 5% 20%;
          --input: 240 5% 20%;
          --ring: 266 100% 50%;
          --radius: 0.5rem;
        }

        :root[data-theme="slytherin"] {
          --background: 160 30% 3%;
          --foreground: 0 0% 98%;
          --card: 160 30% 6%;
          --card-foreground: 0 0% 98%;
          --popover: 160 30% 6%;
          --popover-foreground: 0 0% 98%;
          --primary: 142 76% 36%;
          --primary-foreground: 0 0% 98%;
          --secondary: 160 30% 10%;
          --secondary-foreground: 0 0% 98%;
          --muted: 160 30% 10%;
          --muted-foreground: 160 30% 65%;
          --accent: 142 76% 36%;
          --accent-foreground: 0 0% 98%;
          --destructive: 0 75% 50%;
          --destructive-foreground: 0 0% 98%;
          --border: 160 30% 10%;
          --input: 160 30% 10%;
          --ring: 142 76% 36%;
          --radius: 0.5rem;
        }

        :root[data-theme="gryffindor"] {
          --background: 0 50% 10%;
          --foreground: 45 100% 90%;
          --card: 0 50% 15%;
          --card-foreground: 45 100% 90%;
          --popover: 0 50% 15%;
          --popover-foreground: 45 100% 90%;
          --primary: 22 100% 50%;
          --primary-foreground: 45 100% 90%;
          --secondary: 0 50% 20%;
          --secondary-foreground: 45 100% 90%;
          --muted: 0 50% 20%;
          --muted-foreground: 0 50% 65%;
          --accent: 22 100% 50%;
          --accent-foreground: 45 100% 90%;
          --destructive: 0 75% 50%;
          --destructive-foreground: 45 100% 90%;
          --border: 0 50% 20%;
          --input: 0 50% 20%;
          --ring: 22 100% 50%;
          --radius: 0.5rem;
        }
      `}</style>
      <NextThemesProvider themes={themes} {...props}>
        {children}
      </NextThemesProvider>
    </>
  )
}