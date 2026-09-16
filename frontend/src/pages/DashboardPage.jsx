import React, { useState } from "react"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { SiteHeader } from "@/components/layout/SiteHeader"
import { PageTransition } from "@/components/shared/PageTransition"
import { AdminDashboard } from "@/components/dashboard/AdminDashboard"
import { FacultyDashboard } from "@/components/dashboard/FacultyDashboard"
import { StudentDashboard } from "@/components/dashboard/StudentDashboard"
import { FacultyManager } from "@/components/admin/FacultyManager"
import { StudentManager } from "@/components/admin/StudentManager"
import { AdminManager } from "@/components/admin/AdminManager"
import { SubjectManager } from "@/components/admin/SubjectManager"
import { UserManagement } from "@/components/admin/UserManagement"
import { AttendanceForm } from "@/components/faculty/AttendanceForm"
import { ResultsForm } from "@/components/faculty/ResultsForm"
import { StudentProfile } from "@/components/student/StudentProfile"
import { StudentAttendance } from "@/components/student/StudentAttendance"
import { StudentResults } from "@/components/student/StudentResults"
import { AdminReports } from "@/components/reports/AdminReports"

export function DashboardPage({ session, onLogout }) {
  const role = session?.user?.role || "student"
  const [activeTab, setActiveTab] = useState("overview")
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const renderContent = () => {
    if (activeTab === "overview") {
      if (role === "super_admin" || role === "admin") return <AdminDashboard session={session} />
      if (role === "faculty") return <FacultyDashboard session={session} />
      if (role === "student") return <StudentDashboard session={session} />
    }

    // Admin Views
    if (role === "super_admin" || role === "admin") {
      if (activeTab === "admins" && role === "super_admin") return <AdminManager />
      if (activeTab === "faculty") return <FacultyManager />
      if (activeTab === "students") return <StudentManager />
      if (activeTab === "subjects") return <SubjectManager />
      if (activeTab === "reports") return <AdminReports />
      if (activeTab === "users") return <UserManagement role={role} />
    }

    // Faculty Views
    if (role === "faculty") {
      if (activeTab === "attendance") return <AttendanceForm session={session} />
      if (activeTab === "results") return <ResultsForm session={session} />
      if (activeTab === "students") return <StudentManager />
    }

    // Student Views
    if (role === "student") {
      if (activeTab === "attendance") return <StudentAttendance session={session} />
      if (activeTab === "results") return <StudentResults session={session} />
      if (activeTab === "profile") return <StudentProfile session={session} />
    }

    return <AdminDashboard session={session} />
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Sidebar navigation */}
      <AppSidebar
        role={role}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        <SiteHeader
          session={session}
          onLogout={onLogout}
          onToggleMobileSidebar={() => setIsMobileOpen((prev) => !prev)}
          activeTab={activeTab}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <PageTransition key={activeTab}>
            {renderContent()}
          </PageTransition>
        </main>
      </div>
    </div>
  )
}
