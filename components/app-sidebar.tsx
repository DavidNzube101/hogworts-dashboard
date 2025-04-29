"use client"

import { BarChart3, AlertTriangle, TrendingUp, Newspaper, Home, Settings, Twitter, Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect } from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useMobileMenu } from "./mobile-menu-provider"
import { cn } from "@/lib/utils"
import { ThemeSwitcher } from "./theme-switcher"

export default function AppSidebar() {
  const pathname = usePathname()
  const { isOpen, toggle, close } = useMobileMenu()

  // Close sidebar when route changes on mobile
  useEffect(() => {
    close()
  }, [pathname, close])

  const navItems = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/dashboard",
    },
    {
      title: "Fraud Detection",
      icon: AlertTriangle,
      href: "/fraud-detection",
    },
    {
      title: "Social Sentiment",
      icon: TrendingUp,
      href: "/social-sentiment",
    },
    {
      title: "News Feed",
      icon: Newspaper,
      href: "/news-feed",
    },
    {
      title: "Analytics",
      icon: BarChart3,
      href: "/analytics",
    },
    {
      title: "Twitter Thread",
      icon: Twitter,
      href: "/twitter-thread",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/settings",
    },
  ]

  return (
    <>
      {/* Mobile Hamburger Menu Button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={toggle}
          className="rounded-full bg-background/80 backdrop-blur-sm"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={close}
      />

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 transition-transform duration-300 ease-in-out transform md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Sidebar>
          <SidebarHeader className="p-4 flex flex-row items-center justify-between">
            <h1 className="text-xl font-bold">Hogwarts</h1>
            <ThemeSwitcher />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                        <Link href={item.href}>
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
      </div>
    </>
  )
}
