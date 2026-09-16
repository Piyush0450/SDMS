import React, { useState, useEffect } from "react"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, ShieldAlert, CheckCircle, Trash2 } from "lucide-react"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { UserBlockDialog } from "./UserBlockDialog"

export function FacultyManager() {
  const [faculty, setFaculty] = useState([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [addOpen, setAddOpen] = useState(false)
  const [newFaculty, setNewFaculty] = useState({ name: "", email: "", phone: "", dob: "" })
  const [blockModal, setBlockModal] = useState({ open: false, target: null })

  const fetchFaculty = async () => {
    setLoading(true)
    try {
      const data = await api.get("/api/admin/faculty")
      setFaculty(Array.isArray(data) ? data : data.faculty || [])
    } catch (err) {
      toast.error("Failed to load faculty list")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFaculty()
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await api.post("/api/admin/faculty", newFaculty)
      toast.success("Faculty member created successfully")
      setAddOpen(false)
      setNewFaculty({ name: "", email: "", phone: "", dob: "" })
      fetchFaculty()
    } catch (err) {
      toast.error(err.message || "Failed to create faculty member")
    }
  }

  const handleBlockConfirm = async (role, uid, isBlock, reason) => {
    try {
      const endpoint = isBlock ? `/api/admin/users/faculty/${uid}/block` : `/api/admin/users/faculty/${uid}/unblock`
      await api.post(endpoint, { reason })
      toast.success(`Faculty ${isBlock ? "blocked" : "unblocked"} successfully`)
      fetchFaculty()
    } catch (err) {
      toast.error(err.message || "Action failed")
    }
  }

  const filtered = faculty.filter(f =>
    (f.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (f.u_id || "").toLowerCase().includes(search.toLowerCase()) ||
    (f.email || "").toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Card className="border bg-card shadow-xs">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <CardTitle>Faculty Directory</CardTitle>
          <CardDescription>Manage faculty accounts, active status, and information.</CardDescription>
        </div>

        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="font-semibold cursor-pointer">
              <Plus className="mr-1.5 h-4 w-4" /> Add Faculty
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Register New Faculty</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label>Full Name</Label>
                <Input required value={newFaculty.name} onChange={e => setNewFaculty({ ...newFaculty, name: e.target.value })} placeholder="Dr. John Doe" />
              </div>
              <div className="space-y-1.5">
                <Label>Email Address</Label>
                <Input required type="email" value={newFaculty.email} onChange={e => setNewFaculty({ ...newFaculty, email: e.target.value })} placeholder="faculty@school.edu" />
              </div>
              <div className="space-y-1.5">
                <Label>Phone Number</Label>
                <Input value={newFaculty.phone} onChange={e => setNewFaculty({ ...newFaculty, phone: e.target.value })} placeholder="+1 234 567 890" />
              </div>
              <div className="space-y-1.5">
                <Label>Date of Birth (Default Password YYYY-MM-DD)</Label>
                <Input required type="date" value={newFaculty.dob} onChange={e => setNewFaculty({ ...newFaculty, dob: e.target.value })} />
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full">Create Faculty Member</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        <div className="mb-4 relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search faculty by ID, name, or email..."
            className="pl-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Faculty ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  No faculty records found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((item) => (
                <TableRow key={item.u_id || item.id}>
                  <TableCell className="font-mono text-xs font-bold">{item.u_id}</TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.phone || "—"}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === "blocked" ? "destructive" : "outline"} className="text-[10px]">
                      {item.status || "active"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="xs"
                      variant={item.status === "blocked" ? "outline" : "ghost"}
                      onClick={() => setBlockModal({ open: true, target: { role: "faculty", uid: item.u_id, name: item.name, action: item.status === "blocked" ? "unblock" : "block" } })}
                    >
                      {item.status === "blocked" ? <CheckCircle className="h-3.5 w-3.5 text-emerald-500 mr-1" /> : <ShieldAlert className="h-3.5 w-3.5 text-amber-500 mr-1" />}
                      {item.status === "blocked" ? "Unblock" : "Block"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <UserBlockDialog
          open={blockModal.open}
          onOpenChange={open => setBlockModal(prev => ({ ...prev, open }))}
          targetUser={blockModal.target}
          onConfirm={handleBlockConfirm}
        />
      </CardContent>
    </Card>
  )
}
