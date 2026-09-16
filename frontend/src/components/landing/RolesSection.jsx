import React from "react"
import { motion } from "framer-motion"
import { ShieldAlert, Shield, Users, GraduationCap } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function RolesSection() {
  const roles = [
    {
      title: "Super Admin",
      badge: "Full Control",
      icon: ShieldAlert,
      color: "text-red-500 bg-red-500/10",
      capabilities: [
        "Manage Admin accounts & credentials",
        "Block / unblock any user account",
        "System-wide analytics & audit logs",
        "Export attendance & result data",
      ],
    },
    {
      title: "Admin",
      badge: "Department Control",
      icon: Shield,
      color: "text-blue-500 bg-blue-500/10",
      capabilities: [
        "Manage Faculty & Student directories",
        "Curriculum & Subject catalog management",
        "Institutional performance reports",
        "Block / unblock Faculty & Students",
      ],
    },
    {
      title: "Faculty",
      badge: "Classroom Ops",
      icon: Users,
      color: "text-emerald-500 bg-emerald-500/10",
      capabilities: [
        "Record daily subject attendance",
        "Upload examination scores & grades",
        "View assigned subject rosters",
        "Track pending result entries",
      ],
    },
    {
      title: "Student",
      badge: "Self-Service",
      icon: GraduationCap,
      color: "text-amber-500 bg-amber-500/10",
      capabilities: [
        "View personal profile & enrollment",
        "Track subject-wise attendance %",
        "Inspect exam scores & performance",
        "Instant term marksheet access",
      ],
    },
  ]

  return (
    <section className="py-20 border-b bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Tailored Workspaces for Every Stakeholder
          </h2>
          <p className="text-muted-foreground text-lg">
            Strict authorization rules ensure security, privacy, and streamlined user workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((item, idx) => {
            const Icon = item.icon
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card className="h-full border bg-card shadow-xs flex flex-col justify-between">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`h-10 w-10 rounded-lg ${item.color} flex items-center justify-center`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <Badge variant="outline" className="text-[10px] font-mono uppercase">
                        {item.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl mb-4">{item.title}</CardTitle>
                    <ul className="space-y-2 text-xs text-muted-foreground">
                      {item.capabilities.map((cap, cIdx) => (
                        <li key={cIdx} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
                          <span>{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </CardHeader>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
