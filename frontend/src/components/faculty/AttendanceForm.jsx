import React, { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Check, X, Clock, Send } from "lucide-react"
import { api } from "@/lib/api"
import { toast } from "sonner"

export function AttendanceForm({ session }) {
  const facultyId = session?.user?.uid || "F_001"
  const [subjects, setSubjects] = useState([])
  const [students, setStudents] = useState([])
  const [selectedSubject, setSelectedSubject] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [attendance, setAttendance] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get("/api/admin/subjects").then(res => setSubjects(Array.isArray(res) ? res : res.subjects || [])).catch(() => {})
    api.get("/api/admin/students").then(res => {
      const list = Array.isArray(res) ? res : res.students || []
      setStudents(list)
      const initial = {}
      list.forEach(s => { initial[s.u_id] = "Present" })
      setAttendance(initial)
    }).catch(() => {})
  }, [])

  const setStatus = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedSubject) {
      toast.error("Please select a subject")
      return
    }

    setLoading(true)
    try {
      const payload = {
        faculty_id: facultyId,
        subject_id: selectedSubject,
        date: date,
        records: Object.entries(attendance).map(([student_id, status]) => ({ student_id, status }))
      }
      await api.post("/api/faculty/attendance", payload)
      toast.success("Attendance batch records submitted successfully")
    } catch (err) {
      toast.error(err.message || "Failed to submit attendance")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border bg-card shadow-xs">
      <CardHeader>
        <CardTitle>Mark Attendance Batch</CardTitle>
        <CardDescription>Record daily student attendance status for your assigned subject class.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Select Subject</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose subject..." />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map(s => (
                    <SelectItem key={s.subject_id || s.id} value={String(s.subject_id || s.id)}>
                      {s.subject_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Class Date</Label>
              <Input type="date" value={date} onChange={e => setDate(e.target.value)} required />
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead className="text-right">Attendance Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                      No students available for attendance.
                    </TableCell>
                  </TableRow>
                ) : (
                  students.map(s => {
                    const status = attendance[s.u_id] || "Present"
                    return (
                      <TableRow key={s.u_id}>
                        <TableCell className="font-mono text-xs font-bold">{s.u_id}</TableCell>
                        <TableCell className="font-medium">{s.name}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              type="button"
                              size="xs"
                              variant={status === "Present" ? "default" : "outline"}
                              onClick={() => setStatus(s.u_id, "Present")}
                              className="h-7 text-xs"
                            >
                              <Check className="h-3 w-3 mr-1" /> Present
                            </Button>
                            <Button
                              type="button"
                              size="xs"
                              variant={status === "Absent" ? "destructive" : "outline"}
                              onClick={() => setStatus(s.u_id, "Absent")}
                              className="h-7 text-xs"
                            >
                              <X className="h-3 w-3 mr-1" /> Absent
                            </Button>
                            <Button
                              type="button"
                              size="xs"
                              variant={status === "Late" ? "secondary" : "outline"}
                              onClick={() => setStatus(s.u_id, "Late")}
                              className="h-7 text-xs"
                            >
                              <Clock className="h-3 w-3 mr-1" /> Late
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>

          <Button type="submit" disabled={loading} className="w-full sm:w-auto font-semibold cursor-pointer">
            <Send className="mr-2 h-4 w-4" /> Submit Attendance Batch
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
