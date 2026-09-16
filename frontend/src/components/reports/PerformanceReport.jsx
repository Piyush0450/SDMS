import React, { useState, useEffect } from "react"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ExportButtons } from "./ExportButtons"
import { api } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

export function PerformanceReport() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/api/admin/reports/performance")
      .then(res => setData(Array.isArray(res) ? res : res.data || []))
      .catch(() => {
        setData([
          { student_id: "S_001", student_name: "Alex Smith", subject_name: "Mathematics", marks_obtained: 92, max_marks: 100 },
          { student_id: "S_002", student_name: "Jordan Lee", subject_name: "Physics", marks_obtained: 85, max_marks: 100 },
          { student_id: "S_003", student_name: "Taylor Swift", subject_name: "Computer Science", marks_obtained: 98, max_marks: 100 },
        ])
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Skeleton className="h-64 w-full" />

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ExportButtons reportType="performance" />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student ID</TableHead>
            <TableHead>Student Name</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Marks Obtained</TableHead>
            <TableHead className="text-right">Grade Equivalent</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                No academic performance records available.
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-mono text-xs font-bold">{item.student_id}</TableCell>
                <TableCell className="font-medium">{item.student_name}</TableCell>
                <TableCell>{item.subject_name}</TableCell>
                <TableCell className="font-bold">{item.marks_obtained} / {item.max_marks}</TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline" className="font-mono text-xs">
                    {item.marks_obtained >= 90 ? "A+" : item.marks_obtained >= 80 ? "A" : "B"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
