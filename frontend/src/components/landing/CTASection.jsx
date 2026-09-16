import React from "react"
import { motion } from "framer-motion"
import { LogIn, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTASection({ onLoginClick }) {
  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="rounded-2xl border bg-gradient-to-br from-primary/10 via-background to-muted/50 p-10 sm:p-16 shadow-lg"
        >
          <div className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-6 shadow-md">
            <GraduationCap className="h-7 w-7" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Ready to Experience SDMS?
          </h2>

          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto mb-8">
            Log in with your institutional credentials or sign in with Google OAuth to access your personalized role dashboard.
          </p>

          <Button
            size="lg"
            onClick={onLoginClick}
            className="h-12 px-8 text-base font-semibold shadow-md cursor-pointer"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Sign In to Portal
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
