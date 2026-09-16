import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function StatsCards({ stats = [] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((item, idx) => {
        const Icon = item.icon
        return (
          <Card key={idx} className="border bg-card shadow-xs">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{item.title}</p>
                <h3 className="text-2xl font-bold tracking-tight mt-1">{item.value}</h3>
                {item.subtitle && <p className="text-[11px] text-muted-foreground mt-0.5">{item.subtitle}</p>}
              </div>
              {Icon && (
                <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", item.colorClass || "bg-primary/10 text-primary")}>
                  <Icon className="h-5 w-5" />
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
