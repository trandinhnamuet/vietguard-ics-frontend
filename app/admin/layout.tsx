"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Menu, X, BarChart3, Users } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = usePathname()

  const adminMenus = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: BarChart3,
    },
    {
      label: "Access Count",
      href: "/admin/access-count",
      icon: BarChart3,
    },
    {
      label: "Members",
      href: "/admin/members",
      icon: Users,
    },
  ]

  const isActive = (href: string) => {
    return pathname === href
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      <Header />

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`bg-card border-r border-border transition-all duration-300 ${
            sidebarOpen ? "w-64" : "w-20"
          }`}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            {sidebarOpen && <h2 className="text-lg font-bold text-white">Admin</h2>}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Sidebar Menu */}
          <nav className="p-4 space-y-2">
            {adminMenus.map((menu) => {
              const Icon = menu.icon
              const active = isActive(menu.href)
              return (
                <Link
                  key={menu.href}
                  href={menu.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    active
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span>{menu.label}</span>}
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-8">
            {children}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}
