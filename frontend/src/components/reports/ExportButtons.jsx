import React from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export function ExportButtons({ reportType = "attendance" }) {
  const handleExport = () => {
    const url = `/api/admin/reports/export/${reportType}`
    window.open(url, "_blank")
  }

  return (
    <Button size="sm" variant="outline" onClick={handleExport} className="cursor-pointer">
      <Download className="mr-1.5 h-4 w-4" />
      <span>Export CSV ({reportType})</span>
    </Button>
  )
}
