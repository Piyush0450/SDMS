import React, { useState, useEffect } from "react"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Plus, BookOpen, Search } from "lucide-react"
import { api } from "@/lib/api"
import { toast } from "sonner"

export function SubjectManager() {
  const [subjects, setSubjects] = useState([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [addOpen, setAddOpen] = useState(false)
  const [subjectName, setSubjectName] = useState("")

  const fetchSubjects = async () => {
    setLoading(true)
    try {
      const data = await api.get("/api/admin/subjects")
      setSubjects(Array.isArray(data) ? data : data.subjects || [])
    } catch (err) {
      toast.error("Failed to load subject catalog")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubjects()
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!subjectName.trim()) return
    try {
      await api.post("/api/admin/subjects", { subject_name: subjectName })
      toast.success("Subject added to catalog")
      setAddOpen(false)
      setSubjectName("")
      fetchSubjects()
    } catch (err) {
      toast.error(err.message || "Failed to add subject")
    }
  }

  const filtered = subjects.filter(s =>
    (s.subject_name || "").toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Card className="border bg-card shadow-xs">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <CardTitle>Subject Catalog</CardTitle>
          <CardDescription>Manage curriculum courses and registered subject offerings.</CardDescription>
        </div>

        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="font-semibold cursor-pointer">
              <Plus className="mr-1.5 h-4 w-4" /> Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Subject to Catalog</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label>Subject Name</Label>
                <Input
                  required
                  value={subjectName}
                  onChange={e => setSubjectName(e.target.value)}
                  placeholder="e.g. Advanced Mathematics"
                />
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full">Create Subject</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        <div className="mb-4 relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search subjects..."
            className="pl-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject ID</TableHead>
              <TableHead>Subject Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-6 text-muted-foreground">
                  No subjects found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((item) => (
                <TableRow key={item.subject_id || item.id}>
                  <TableCell className="font-mono text-xs font-bold">#{item.subject_id || item.id}</TableCell>
                  <TableCell className="font-medium flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span>{item.subject_name}</span>
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
