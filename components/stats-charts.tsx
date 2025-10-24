"use client"

import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"

// Mock data for scanned apps
const scannedAppsData = [
  { name: "Jan", value: 1200 },
  { name: "Feb", value: 1900 },
  { name: "Mar", value: 1600 },
  { name: "Apr", value: 2200 },
  { name: "May", value: 2800 },
  { name: "Jun", value: 3500 },
]

// Mock data for vulnerabilities
const vulnerabilitiesData = [
  { name: "Critical", value: 15, percentage: 15 },
  { name: "High", value: 28, percentage: 28 },
  { name: "Medium", value: 35, percentage: 35 },
  { name: "Low", value: 22, percentage: 22 },
]

// Mock data for app categories
const appCategoriesData = [
  { name: "Finance", value: 850 },
  { name: "Government", value: 620 },
  { name: "Entertainment", value: 1200 },
  { name: "Gaming", value: 1800 },
  { name: "Social", value: 950 },
  { name: "Productivity", value: 780 },
  { name: "Other", value: 800 },
]

const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e"]
const CATEGORY_COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4", "#6366f1"]

export function StatsCharts() {
  const { t } = useLanguage()

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-2">{t("charts.title")}</h2>
        <p className="text-muted-foreground">{t("home.subtitle")}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Scanned Apps Chart */}
        <Card className="bg-card border border-border">
          <CardHeader>
            <CardTitle>{t("charts.scannedApps")}</CardTitle>
            <CardDescription>Số lượng ứng dụng được quét theo tháng</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scannedAppsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="value" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Vulnerabilities Distribution */}
        <Card className="bg-card border border-border">
          <CardHeader>
            <CardTitle>{t("charts.vulnerabilities")}</CardTitle>
            <CardDescription>Phân bố tỉ lệ % các loại lỗ hổng</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={vulnerabilitiesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {vulnerabilitiesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* App Categories Chart */}
      <Card className="bg-card border border-border">
        <CardHeader>
          <CardTitle>{t("charts.appCategories")}</CardTitle>
          <CardDescription>Thống kê phân loại ứng dụng đã quét</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={appCategoriesData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis type="number" stroke="var(--color-muted-foreground)" />
              <YAxis dataKey="name" type="category" stroke="var(--color-muted-foreground)" width={100} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="value" fill="var(--color-primary)" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
