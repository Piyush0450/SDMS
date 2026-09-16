import React, { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { FacultyManager } from "./FacultyManager"
import { StudentManager } from "./StudentManager"
import { AdminManager } from "./AdminManager"

export function UserManagement({ role }) {
  const isSuperAdmin = role === "super_admin"

  return (
    <Card className="border bg-card shadow-xs">
      <CardHeader>
        <CardTitle>User Account Management</CardTitle>
        <CardDescription>Centralized administration of institutional user roles, accounts, and suspensions.</CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="students" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="faculty">Faculty</TabsTrigger>
            {isSuperAdmin && <TabsTrigger value="admins">Administrators</TabsTrigger>}
          </TabsList>

          <TabsContent value="students">
            <StudentManager />
          </TabsContent>

          <TabsContent value="faculty">
            <FacultyManager />
          </TabsContent>

          {isSuperAdmin && (
            <TabsContent value="admins">
              <AdminManager />
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  )
}
export default UserManagement;
