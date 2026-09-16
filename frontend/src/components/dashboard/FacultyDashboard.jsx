import React, { useState, useEffect } from "react"
import { StatsCards } from "./StatsCards"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { ClipboardCheck, FileText, Users, BookOpen } from "lucide-react"
import { api } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

export function FacultyDashboard({ session }) {
  const uid = session?.user?.uid || "F_001"
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    api.get(`/api/dashboard/faculty/${uid}/stats`)
      .then((data) => {
        if (isMounted) setStats(data)
      })
      .catch(() => {
        if (isMounted) {
          setStats({
            assigned_subjects: 3,
            total_students: 140,
            attendance_recorded_today: true,
            pending_results: 2,
          })
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => { isMounted = false }
  }, [uid])

  if (loading) {
    return <Skeleton className="h-64 w-full" />
  }

  const kpiData = [
    { title: "Assigned Subjects", value: stats?.assigned_subjects || 3, icon: BookOpen, colorClass: "bg-blue-500/10 text-blue-500" },
    { title: "Total Students Load", value: stats?.total_students || 140, icon: Users, colorClass: "bg-emerald-500/10 text-emerald-500" },
    { title: "Attendance Today", value: stats?.attendance_recorded_today ? "Completed" : "Pending", icon: ClipboardCheck, colorClass: "bg-amber-500/10 text-amber-500" },
    { title: "Pending Result Uploads", value: stats?.pending_results || 0, icon: FileText, colorClass: "bg-purple-500/10 text-purple-500" },
  ]

  return (
    <div className="space-y-6">
      <StatsCards stats={kpiData} />

      <Card className="border bg-card shadow-xs">
        <CardHeader>
          <CardTitle>Faculty Quick Tasks</CardTitle>
          <CardDescription>Common daily classroom management activities.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg bg-muted/20 flex flex-col justify-between">
            <div>
              <h4 className="font-semibold text-sm mb-1">Daily Attendance Entry</h4>
              <p className="text-xs text-muted-foreground">Record attendance for today's active classes and labs.</p>
            </div>
          </div>
          <div className="p-4 border rounded-lg bg-muted/20 flex flex-col justify-between">
            <div>
              <h4 className="font-semibold text-sm mb-1">Term Examination Results</h4>
              <p className="text-xs text-muted-foreground">Upload and publish scores for mid-term and final exams.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
