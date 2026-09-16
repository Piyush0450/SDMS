import React, { useState } from "react"
import { ThemeProvider } from "@/components/layout/ThemeProvider"
import { AuthProvider, useAuth } from "@/hooks/useAuth"
import { LandingPage } from "@/pages/LandingPage"
import { DashboardPage } from "@/pages/DashboardPage"
import { AuthPanel } from "@/components/auth/AuthPanel"
import { Toaster } from "@/components/ui/sonner"

function MainApp() {
  const { session, logout } = useAuth()
  const [authOpen, setAuthOpen] = useState(false)

  if (session) {
    return <DashboardPage session={session} onLogout={logout} />
  }

  return (
    <>
      <LandingPage onLoginClick={() => setAuthOpen(true)} />
      <AuthPanel open={authOpen} onOpenChange={setAuthOpen} />
    </>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
        <Toaster position="top-right" closeButton />
      </AuthProvider>
    </ThemeProvider>
  )
}
