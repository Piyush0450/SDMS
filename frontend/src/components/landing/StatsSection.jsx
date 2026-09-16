import React from "react"
import { useCounter } from "@/hooks/useCounter"
import { Card } from "@/components/ui/card"

export function StatsSection() {
  const containerRef = useCounter(100)

  const stats = [
    { number: "1500", suffix: "+", label: "Active Students Managed" },
    { number: "120", suffix: "+", label: "Faculty Members" },
    { number: "98", suffix: "%", label: "Attendance Precision" },
    { number: "33", suffix: "", label: "REST API Endpoints" },
  ]

  return (
    <section ref={containerRef} className="py-16 border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((item, idx) => (
            <Card key={idx} className="p-6 border bg-card shadow-xs flex flex-col items-center justify-center">
              <div className="text-3xl sm:text-5xl font-extrabold text-primary mb-2 flex items-center justify-center">
                <span className="counter">{item.number}</span>
                <span>{item.suffix}</span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">{item.label}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
