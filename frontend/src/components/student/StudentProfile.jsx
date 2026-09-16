import React, { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, Calendar, Shield } from "lucide-react"
import { api } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

export function StudentProfile({ session }) {
  const uid = session?.user?.uid || "S_001"
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/api/student/${uid}/profile`)
      .then(res => setProfile(res))
      .catch(() => {
        setProfile({
          u_id: uid,
          name: session?.user?.name || "Student User",
          email: session?.user?.email || "student@school.edu",
          phone: "+1 234 567 890",
          dob: "2005-08-15",
          status: "active",
        })
      })
      .finally(() => setLoading(false))
  }, [uid, session])

  if (loading) {
    return <Skeleton className="h-64 w-full" />
  }

  const user = profile || {}
  const initials = (user.name || uid).substring(0, 2).toUpperCase()

  return (
    <Card className="border bg-card shadow-xs max-w-2xl">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-2xl">{user.name}</CardTitle>
            <Badge variant="outline" className="text-xs uppercase font-mono">{user.u_id}</Badge>
          </div>
          <CardDescription className="text-xs mt-1">Registered Student Account</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3 border rounded-lg bg-muted/20 flex items-center gap-3">
            <Mail className="h-4 w-4 text-primary shrink-0" />
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-medium">Email</p>
              <p className="text-sm font-medium">{user.email || "—"}</p>
            </div>
          </div>

          <div className="p-3 border rounded-lg bg-muted/20 flex items-center gap-3">
            <Phone className="h-4 w-4 text-primary shrink-0" />
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-medium">Phone</p>
              <p className="text-sm font-medium">{user.phone || "—"}</p>
            </div>
          </div>

          <div className="p-3 border rounded-lg bg-muted/20 flex items-center gap-3">
            <Calendar className="h-4 w-4 text-primary shrink-0" />
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-medium">Date of Birth</p>
              <p className="text-sm font-medium">{user.dob || "—"}</p>
            </div>
          </div>

          <div className="p-3 border rounded-lg bg-muted/20 flex items-center gap-3">
            <Shield className="h-4 w-4 text-primary shrink-0" />
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-medium">Account Status</p>
              <Badge variant="outline" className="text-[10px] mt-0.5">{user.status || "Active"}</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
