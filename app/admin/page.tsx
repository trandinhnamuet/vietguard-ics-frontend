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
      color: "from-blue-600 to-cyan-600",
    },
    {
      title: "Members",
      description: "Manage registered members and their information",
      icon: Users,
      href: "/admin/members",
      color: "from-purple-600 to-pink-600",
    },
    {
      title: "Activity Logs",
      description: "View system activity and user interactions",
      icon: Activity,
      href: "/admin/activity",
      color: "from-green-600 to-emerald-600",
      disabled: true,
    },
  ]

  return (
    <div className="max-w-6xl mx-auto min-h-[calc(100vh-200px)]">
      {/* Page Header */}
      <div className="mb-16">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-xl text-slate-300">
          Manage and monitor your VietGuardScan platform
        </p>
      </div>

      {/* Admin Pages Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {adminPages.map((page) => {
          const Icon = page.icon
          return (
            <div
              key={page.href}
              className={`bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 hover:scale-105 hover:-translate-y-2 ${
                page.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-slate-800/60"
              }`}
            >
              {/* Icon */}
              <div
                className={`w-16 h-16 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-br ${page.color} shadow-lg`}
              >
                <Icon className="w-8 h-8 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold mb-3 text-white">
                {page.title}
              </h3>
              <p className="text-slate-400 text-base mb-8 leading-relaxed">
                {page.description}
              </p>

              {/* Action */}
              {page.disabled ? (
                <button className="w-full px-6 py-3 bg-slate-700 text-slate-400 rounded-lg cursor-not-allowed opacity-50">
                  Coming Soon
                </button>
              ) : (
                <Link href={page.href} className="block">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 transition-all duration-200 hover:scale-105">
                    Go to {page.title}
                  </Button>
                </Link>
              )}
            </div>
          )
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 hover:bg-slate-800/60 transition-all duration-200 hover:scale-105">
          <p className="text-slate-400 text-sm mb-3">Total Modules</p>
          <p className="text-4xl font-bold text-white mb-2">2</p>
          <p className="text-xs text-slate-500">Access & Members management</p>
        </div>

        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 hover:bg-slate-800/60 transition-all duration-200 hover:scale-105">
          <p className="text-slate-400 text-sm mb-3">Status</p>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse"></div>
            <p className="text-white font-bold text-xl">Operational</p>
          </div>
          <p className="text-xs text-slate-500">All systems running</p>
        </div>

        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 hover:bg-slate-800/60 transition-all duration-200 hover:scale-105">
          <p className="text-slate-400 text-sm mb-3">Last Updated</p>
          <p className="text-white font-bold text-xl mb-2">Just now</p>
          <p className="text-xs text-slate-500">Real-time data</p>
        </div>
      </div>
    </div>
  )
}
