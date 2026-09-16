import React from "react"
import { PageTransition } from "@/components/shared/PageTransition"
import { Hero } from "@/components/landing/Hero"
import { Features } from "@/components/landing/Features"
import { StatsSection } from "@/components/landing/StatsSection"
import { RolesSection } from "@/components/landing/RolesSection"
import { CTASection } from "@/components/landing/CTASection"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import { Button } from "@/components/ui/button"
import { GraduationCap, LogIn } from "lucide-react"

export function LandingPage({ onLoginClick }) {
  return (
    <PageTransition className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <div>
        {/* Landing Navbar */}
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="font-extrabold tracking-tight text-xl">SDMS Portal</span>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button onClick={onLoginClick} size="sm" className="font-semibold cursor-pointer">
                <span>Login</span>
                <LogIn className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Storytelling sections */}
        <main>
          <Hero onLoginClick={onLoginClick} />
          <Features />
          <StatsSection />
          <RolesSection />
          <CTASection onLoginClick={onLoginClick} />
        </main>
      </div>

      {/* Landing Footer */}
      <footer className="border-t py-8 bg-muted/30 text-center text-xs text-muted-foreground">
        <div className="container mx-auto px-4">
          <p>© 2026 SDMS — Student Data Management System. All rights reserved.</p>
        </div>
      </footer>
    </PageTransition>
  )
}
