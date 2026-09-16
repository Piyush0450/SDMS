import React, { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { Upload, FileText } from "lucide-react"
import { api } from "@/lib/api"
import { toast } from "sonner"

export function ResultsForm({ session }) {
  const facultyId = session?.user?.uid || "F_001"
  const [subjects, setSubjects] = useState([])
  const [students, setStudents] = useState([])
  const [selectedSubject, setSelectedSubject] = useState("")
  const [maxMarks, setMaxMarks] = useState("100")
  const [marksData, setMarksData] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get("/api/admin/subjects").then(res => setSubjects(Array.isArray(res) ? res : res.subjects || [])).catch(() => {})
    api.get("/api/admin/students").then(res => {
      const list = Array.isArray(res) ? res : res.students || []
      setStudents(list)
    }).catch(() => {})
  }, [])

  const handleMarkChange = (studentId, val) => {
    setMarksData(prev => ({ ...prev, [studentId]: val }))
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
        max_marks: parseFloat(maxMarks) || 100,
        results: Object.entries(marksData).map(([student_id, marks_obtained]) => ({
          student_id,
          marks_obtained: parseFloat(marks_obtained) || 0
        }))
      }
      await api.post("/api/faculty/results", payload)
      toast.success("Examination marks uploaded successfully")
    } catch (err) {
      toast.error(err.message || "Failed to upload marks")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border bg-card shadow-xs">
      <CardHeader>
        <CardTitle>Upload Examination Results</CardTitle>
        <CardDescription>Enter student examination marks for your assigned subject.</CardDescription>
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
              <Label>Maximum Marks</Label>
              <Input type="number" value={maxMarks} onChange={e => setMaxMarks(e.target.value)} required />
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead className="w-48 text-right">Marks Obtained</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                      No students available for marks entry.
                    </TableCell>
                  </TableRow>
                ) : (
                  students.map(s => (
                    <TableRow key={s.u_id}>
                      <TableCell className="font-mono text-xs font-bold">{s.u_id}</TableCell>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="number"
                          placeholder="0"
                          max={maxMarks}
                          value={marksData[s.u_id] || ""}
                          onChange={e => handleMarkChange(s.u_id, e.target.value)}
                          className="w-28 text-right ml-auto"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <Button type="submit" disabled={loading} className="w-full sm:w-auto font-semibold cursor-pointer">
            <Upload className="mr-2 h-4 w-4" /> Upload Results
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
