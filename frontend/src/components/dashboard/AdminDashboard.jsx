import React, { useState, useEffect } from "react"
import { StatsCards } from "./StatsCards"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Users, GraduationCap, BookOpen, ShieldAlert, BarChart3 } from "lucide-react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { api } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

export function AdminDashboard({ session }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    api.get("/api/dashboard/admin/stats")
      .then((data) => {
        if (isMounted) setStats(data)
      })
      .catch(() => {
        if (isMounted) {
          // Fallback mock stats for offline preview
          setStats({
            total_students: 1240,
            total_faculty: 48,
            total_subjects: 18,
            avg_attendance: 92.4,
            chart_data: [
              { subject: "Mathematics", attendance: 95 },
              { subject: "Physics", attendance: 88 },
              { subject: "Computer Science", attendance: 96 },
              { subject: "Chemistry", attendance: 91 },
              { subject: "Biology", attendance: 89 },
            ]
          })
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => { isMounted = false }
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <Skeleton className="h-80 w-full" />
      </div>
    )
  }

  const kpiData = [
    { title: "Total Students", value: stats?.total_students || 0, icon: GraduationCap, colorClass: "bg-blue-500/10 text-blue-500" },
    { title: "Faculty Members", value: stats?.total_faculty || 0, icon: Users, colorClass: "bg-emerald-500/10 text-emerald-500" },
    { title: "Active Subjects", value: stats?.total_subjects || 0, icon: BookOpen, colorClass: "bg-amber-500/10 text-amber-500" },
    { title: "Avg Attendance", value: `${stats?.avg_attendance || 0}%`, icon: BarChart3, colorClass: "bg-purple-500/10 text-purple-500" },
  ]

  const chartData = stats?.chart_data || [
    { subject: "Mathematics", attendance: 92 },
    { subject: "Physics", attendance: 87 },
    { subject: "Computer Science", attendance: 95 },
    { subject: "Chemistry", attendance: 89 },
  ]

  return (
    <div className="space-y-6">
      <StatsCards stats={kpiData} />

      <Card className="border bg-card shadow-xs">
        <CardHeader>
          <CardTitle>Attendance Distribution by Subject</CardTitle>
          <CardDescription>Average recorded attendance percentage across major courses.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="subject" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }}
                />
                <Bar dataKey="attendance" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
