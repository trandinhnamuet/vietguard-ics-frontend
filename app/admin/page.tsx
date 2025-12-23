"use client"

import Link from "next/link"
import { BarChart3, Users, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminDashboard() {
  const adminPages = [
    {
      title: "Access Count",
      description: "Monitor website access logs and visitor statistics",
      icon: BarChart3,
      href: "/admin/access-count",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Members",
      description: "Manage registered members and their information",
      icon: Users,
      href: "/admin/members",
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Activity Logs",
      description: "View system activity and user interactions",
      icon: Activity,
      href: "/admin/activity",
      color: "from-green-500 to-emerald-500",
      disabled: true,
    },
  ]

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-lg text-muted-foreground">
          Manage and monitor your VietGuardScan platform
        </p>
      </div>

      {/* Admin Pages Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminPages.map((page) => {
          const Icon = page.icon
          return (
            <div
              key={page.href}
              className={`bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300 ${
                page.disabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-lg mb-4 flex items-center justify-center bg-gradient-to-br ${page.color}`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold mb-2 text-white">
                {page.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                {page.description}
              </p>

              {/* Action */}
              {page.disabled ? (
                <button className="w-full px-4 py-2 bg-muted text-muted-foreground rounded-lg cursor-not-allowed opacity-50">
                  Coming Soon
                </button>
              ) : (
                <Link href={page.href} className="block">
                  <Button className="w-full">
                    Go to {page.title}
                  </Button>
                </Link>
              )}
            </div>
          )
        })}
      </div>

      {/* Quick Stats */}
      <div className="mt-16 grid md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-muted-foreground text-sm mb-2">Total Modules</p>
          <p className="text-3xl font-bold text-white">2</p>
          <p className="text-xs text-muted-foreground mt-2">Access & Members management</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-muted-foreground text-sm mb-2">Status</p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
            <p className="text-white font-semibold">Operational</p>
          </div>
          <p className="text-xs text-muted-foreground mt-2">All systems running</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-muted-foreground text-sm mb-2">Last Updated</p>
          <p className="text-white font-semibold">Just now</p>
          <p className="text-xs text-muted-foreground mt-2">Real-time data</p>
        </div>
      </div>
    </div>
  )
}
