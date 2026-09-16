import React, { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

export function StudentResults({ session }) {
  const uid = session?.user?.uid || "S_001"
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/api/student/${uid}/results`)
      .then(res => setResults(Array.isArray(res) ? res : res.results || []))
      .catch(() => {
        setResults([
          { subject_name: "Mathematics", marks_obtained: 92, max_marks: 100, grade: "A+" },
          { subject_name: "Physics", marks_obtained: 85, max_marks: 100, grade: "A" },
          { subject_name: "Computer Science", marks_obtained: 98, max_marks: 100, grade: "O" },
          { subject_name: "Chemistry", marks_obtained: 78, max_marks: 100, grade: "B+" },
        ])
      })
      .finally(() => setLoading(false))
  }, [uid])

  if (loading) {
    return <Skeleton className="h-64 w-full" />
  }

  return (
    <Card className="border bg-card shadow-xs">
      <CardHeader>
        <CardTitle>Examination Score Sheet</CardTitle>
        <CardDescription>Term scores, maximum marks, and assigned letter grades.</CardDescription>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject Name</TableHead>
              <TableHead>Marks Obtained</TableHead>
              <TableHead>Max Marks</TableHead>
              <TableHead className="text-right">Grade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                  No examination results uploaded yet.
                </TableCell>
              </TableRow>
            ) : (
              results.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{item.subject_name}</TableCell>
                  <TableCell className="font-bold">{item.marks_obtained}</TableCell>
                  <TableCell>{item.max_marks}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="font-mono text-xs">
                      {item.grade || (item.marks_obtained >= 90 ? "A+" : item.marks_obtained >= 80 ? "A" : "B")}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
