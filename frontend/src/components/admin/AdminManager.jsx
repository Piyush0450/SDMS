import React, { useState, useEffect } from "react"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, ShieldAlert, CheckCircle } from "lucide-react"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { UserBlockDialog } from "./UserBlockDialog"

export function AdminManager() {
  const [admins, setAdmins] = useState([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [addOpen, setAddOpen] = useState(false)
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", phone: "", dob: "", admin_type: "normal" })
  const [blockModal, setBlockModal] = useState({ open: false, target: null })

  const fetchAdmins = async () => {
    setLoading(true)
    try {
      const data = await api.get("/api/admin/admins")
      setAdmins(Array.isArray(data) ? data : data.admins || [])
    } catch (err) {
      toast.error("Failed to load admin list")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdmins()
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await api.post("/api/admin/admins", newAdmin)
      toast.success("Administrator account created successfully")
      setAddOpen(false)
      setNewAdmin({ name: "", email: "", phone: "", dob: "", admin_type: "normal" })
      fetchAdmins()
    } catch (err) {
      toast.error(err.message || "Failed to create administrator")
    }
  }

  const handleBlockConfirm = async (role, uid, isBlock, reason) => {
    try {
      const endpoint = isBlock ? `/api/admin/users/admin/${uid}/block` : `/api/admin/users/admin/${uid}/unblock`
      await api.post(endpoint, { reason })
      toast.success(`Admin ${isBlock ? "blocked" : "unblocked"} successfully`)
      fetchAdmins()
    } catch (err) {
      toast.error(err.message || "Action failed")
    }
  }

  const filtered = admins.filter(a =>
    (a.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (a.u_id || "").toLowerCase().includes(search.toLowerCase()) ||
    (a.email || "").toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Card className="border bg-card shadow-xs">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <CardTitle>Administrator Directory (Super Admin Only)</CardTitle>
          <CardDescription>Manage administrator privileges, super accounts, and active status.</CardDescription>
        </div>

        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="font-semibold cursor-pointer">
              <Plus className="mr-1.5 h-4 w-4" /> Add Admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Register New Administrator</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label>Full Name</Label>
                <Input required value={newAdmin.name} onChange={e => setNewAdmin({ ...newAdmin, name: e.target.value })} placeholder="Admin Name" />
              </div>
              <div className="space-y-1.5">
                <Label>Email Address</Label>
                <Input required type="email" value={newAdmin.email} onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })} placeholder="admin@school.edu" />
              </div>
              <div className="space-y-1.5">
                <Label>Date of Birth (Default Password YYYY-MM-DD)</Label>
                <Input required type="date" value={newAdmin.dob} onChange={e => setNewAdmin({ ...newAdmin, dob: e.target.value })} />
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full">Create Admin Account</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        <div className="mb-4 relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search admins by ID, name, or email..."
            className="pl-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Admin ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  No administrator records found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((item) => (
                <TableRow key={item.u_id || item.id}>
                  <TableCell className="font-mono text-xs font-bold">{item.u_id}</TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>
                    <Badge variant={item.admin_type === "super" ? "default" : "secondary"} className="text-[10px] uppercase font-mono">
                      {item.admin_type || "normal"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.status === "blocked" ? "destructive" : "outline"} className="text-[10px]">
                      {item.status || "active"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {item.admin_type !== "super" && (
                      <Button
                        size="xs"
                        variant={item.status === "blocked" ? "outline" : "ghost"}
                        onClick={() => setBlockModal({ open: true, target: { role: "admin", uid: item.u_id, name: item.name, action: item.status === "blocked" ? "unblock" : "block" } })}
                      >
                        {item.status === "blocked" ? <CheckCircle className="h-3.5 w-3.5 text-emerald-500 mr-1" /> : <ShieldAlert className="h-3.5 w-3.5 text-amber-500 mr-1" />}
                        {item.status === "blocked" ? "Unblock" : "Block"}
                      </Button>
                    )}
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
