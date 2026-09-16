import React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { AttendanceReport } from "./AttendanceReport"
import { PerformanceReport } from "./PerformanceReport"

export function AdminReports() {
  return (
    <Card className="border bg-card shadow-xs">
      <CardHeader>
        <CardTitle>Institutional Analytics & Reports</CardTitle>
        <CardDescription>View, filter, and export comprehensive attendance summaries and performance data.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="attendance" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="attendance">Attendance Summary</TabsTrigger>
            <TabsTrigger value="performance">Academic Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="attendance">
            <AttendanceReport />
          </TabsContent>

          <TabsContent value="performance">
            <PerformanceReport />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
export default AdminReports;
