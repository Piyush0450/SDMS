import React from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export function NotFoundPage({ onGoHome }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground text-center p-4">
      <div className="h-16 w-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-4">
        <AlertCircle className="h-8 w-8" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight mb-2">404 - Page Not Found</h1>
      <p className="text-muted-foreground text-base max-w-md mb-6">
        The requested view or page resource could not be found.
      </p>
      <Button onClick={onGoHome} className="font-semibold cursor-pointer">
        Return to Portal Home
      </Button>
    </div>
  )
}
