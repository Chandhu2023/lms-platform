"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { BarChart3, BookOpen, Home, LogOut, Menu, MessageSquare, Settings, Users, Video } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

type NavItem = {
  title: string
  href: string
  icon: React.ElementType
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = usePathname()

  const adminNavItems: NavItem[] = [
    { title: "Dashboard", href: "/admin/dashboard", icon: Home },
    { title: "Courses", href: "/admin/courses", icon: BookOpen },
    { title: "Videos", href: "/admin/videos", icon: Video },
    { title: "Users", href: "/admin/users", icon: Users },
    { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { title: "Messages", href: "/admin/messages", icon: MessageSquare },
    { title: "Settings", href: "/admin/settings", icon: Settings },
  ]

  const trainerNavItems: NavItem[] = [
    { title: "Dashboard", href: "/trainer/dashboard", icon: Home },
    { title: "My Courses", href: "/trainer/courses", icon: BookOpen },
    { title: "Videos", href: "/trainer/videos", icon: Video },
    { title: "Students", href: "/trainer/students", icon: Users },
    { title: "Messages", href: "/trainer/messages", icon: MessageSquare },
    { title: "Settings", href: "/trainer/settings", icon: Settings },
  ]

  const studentNavItems: NavItem[] = [
    { title: "Dashboard", href: "/student/dashboard", icon: Home },
    { title: "My Courses", href: "/student/courses", icon: BookOpen },
    { title: "Messages", href: "/student/messages", icon: MessageSquare },
    { title: "Settings", href: "/student/settings", icon: Settings },
  ]

  const navItems = user?.role === "admin" ? adminNavItems : user?.role === "trainer" ? trainerNavItems : studentNavItems

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-card text-card-foreground border-r fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-4 py-4 border-b">
            <h2 className="text-xl font-bold">LMS Platform</h2>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Close sidebar</span>
            </Button>
          </div>

          <div className="flex-1 overflow-auto py-4">
            <nav className="space-y-1 px-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                    pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>

          <div className="border-t p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div>
                <p className="font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
            </div>
            <Button variant="outline" className="w-full justify-start gap-2" onClick={logout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="bg-card text-card-foreground border-b">
          <div className="flex h-16 items-center justify-between px-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className={cn("md:hidden", sidebarOpen && "hidden")}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open sidebar</span>
            </Button>

            <div className="ml-auto flex items-center gap-4">
              <ModeToggle />
              <span className="text-sm font-medium">Welcome, {user?.name}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-muted/40 p-4">{children}</main>
      </div>
    </div>
  )
}

