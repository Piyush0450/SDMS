import React from "react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { LoginForm } from "./LoginForm"
import { GoogleButton } from "./GoogleButton"
import { useAuth } from "@/hooks/useAuth"

export function AuthPanel({ open, onOpenChange }) {
  const { loginWithCredentials, loginWithGoogle, loading } = useAuth()

  const handleCredentialsSubmit = async (username, password) => {
    try {
      await loginWithCredentials(username, password)
      onOpenChange(false)
    } catch (err) {
      // toast is triggered inside useAuth
    }
  }

  const handleGoogleClick = async () => {
    try {
      await loginWithGoogle()
      onOpenChange(false)
    } catch (err) {
      // toast triggered inside useAuth
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Sign In to SDMS</DialogTitle>
          <DialogDescription className="text-center text-xs">
            Access your academic dashboard, attendance logs, and performance metrics.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <GoogleButton onClick={handleGoogleClick} loading={loading} />

          <div className="relative flex items-center justify-center">
            <Separator />
            <span className="absolute bg-background px-3 text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
              Or credentials
            </span>
          </div>

          <LoginForm onSubmit={handleCredentialsSubmit} loading={loading} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
