import React from "react"
import {
  LayoutDashboard, Users, GraduationCap, BookOpen,
  ClipboardCheck, BarChart3, UserCheck, ShieldAlert, FileText, User
} from "lucide-react"
import { cn } from "@/lib/utils"

export function AppSidebar({ role, activeTab, onTabChange, isMobileOpen, onCloseMobile }) {
  const getNavItems = () => {
    switch (role) {
      case "super_admin":
        return [
          { id: "overview", label: "Overview", icon: LayoutDashboard },
          { id: "admins", label: "Admin Accounts", icon: ShieldAlert },
          { id: "faculty", label: "Faculty Directory", icon: Users },
          { id: "students", label: "Student Roster", icon: GraduationCap },
          { id: "subjects", label: "Subjects Catalog", icon: BookOpen },
          { id: "reports", label: "Analytics & Reports", icon: BarChart3 },
          { id: "users", label: "User Management", icon: UserCheck },
        ]
      case "admin":
        return [
          { id: "overview", label: "Overview", icon: LayoutDashboard },
          { id: "faculty", label: "Faculty Directory", icon: Users },
          { id: "students", label: "Student Roster", icon: GraduationCap },
          { id: "subjects", label: "Subjects Catalog", icon: BookOpen },
          { id: "reports", label: "Analytics & Reports", icon: BarChart3 },
          { id: "users", label: "User Management", icon: UserCheck },
        ]
      case "faculty":
        return [
          { id: "overview", label: "Overview", icon: LayoutDashboard },
          { id: "attendance", label: "Mark Attendance", icon: ClipboardCheck },
          { id: "results", label: "Upload Results", icon: FileText },
          { id: "students", label: "My Students", icon: GraduationCap },
        ]
      case "student":
        return [
          { id: "overview", label: "Overview", icon: LayoutDashboard },
          { id: "attendance", label: "My Attendance", icon: ClipboardCheck },
          { id: "results", label: "My Results", icon: FileText },
          { id: "profile", label: "My Profile", icon: User },
        ]
      default:
        return []
    }
  }

  const items = getNavItems()

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 md:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-64 border-r bg-sidebar text-sidebar-foreground transition-transform duration-300 md:static md:translate-x-0 flex flex-col justify-between",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div>
          {/* Brand header */}
          <div className="flex h-16 items-center gap-3 px-6 border-b border-sidebar-border">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base tracking-tight leading-none">SDMS Portal</h2>
              <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
                {role ? role.replace("_", " ") : "Academic System"}
              </span>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="p-3 space-y-1">
            {items.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id)
                    if (onCloseMobile) onCloseMobile()
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-sidebar-border text-xs text-muted-foreground">
          <p className="font-medium">SDMS v2.0</p>
          <p className="text-[11px] opacity-75">Student Data Management</p>
        </div>
      </aside>
    </>
  )
}
