import React from "react"
import { useScrollReveal } from "@/hooks/useScrollReveal"
import { ShieldCheck, ClipboardCheck, BarChart3, Users, Zap, FileSpreadsheet } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export function Features() {
  const containerRef = useScrollReveal()

  const featuresList = [
    {
      icon: ShieldCheck,
      title: "Role-Based Access Control",
      description: "Strict multi-tier permission matrix governing Super Admin, Admin, Faculty, and Student privileges.",
    },
    {
      icon: ClipboardCheck,
      title: "Automated Attendance Logs",
      description: "Faculty can record daily subject-wise student attendance with automated calculation of attendance ratios.",
    },
    {
      icon: BarChart3,
      title: "Real-Time Analytical Charts",
      description: "Visual performance graphs powered by Recharts detailing distribution metrics and enrollment trends.",
    },
    {
      icon: Users,
      title: "Complete User Directory",
      description: "Structured directories for managing administrators, faculty members, and student rosters effortlessly.",
    },
    {
      icon: FileSpreadsheet,
      title: "CSV Export Reporting",
      description: "Instant data exports for institutional attendance summary logs and term performance marksheets.",
    },
    {
      icon: Zap,
      title: "Dual Authentication",
      description: "Secure login using institutional UID/DOB credentials or Google OAuth via Firebase Authentication.",
    },
  ]

  return (
    <section id="features-section" ref={containerRef} className="py-20 border-b bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Built for Modern Academic Administration
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything your institution needs to simplify records management and track student progress.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuresList.map((item, idx) => {
            const Icon = item.icon
            return (
              <Card key={idx} className="reveal border bg-card/80 backdrop-blur hover:border-primary/50 transition-colors shadow-xs">
                <CardHeader>
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-xl mb-2">{item.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">{item.description}</CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
