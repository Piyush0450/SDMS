import React, { useRef } from "react"
import { motion } from "framer-motion"
import { useGSAP, gsap } from "@/lib/gsap"
import { GraduationCap, ArrowRight, ShieldCheck, Sparkles, BarChart2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero({ onLoginClick }) {
  const containerRef = useRef(null)

  useGSAP(() => {
    if (!containerRef.current) return;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
    tl.from(".hero-badge", { opacity: 0, y: -20, duration: 0.6 })
      .from(".hero-title", { opacity: 0, y: 30, duration: 0.8 }, "-=0.3")
      .from(".hero-subtitle", { opacity: 0, y: 20, duration: 0.6 }, "-=0.4")
      .from(".hero-buttons", { opacity: 0, scale: 0.95, duration: 0.5 }, "-=0.3")
  }, { scope: containerRef })

  return (
    <div ref={containerRef} className="relative overflow-hidden py-20 lg:py-32 border-b bg-background">
      {/* Background ambient gradient motion blobs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary/20 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl pointer-events-none"
      />

      <div className="container relative z-10 mx-auto px-4 text-center max-w-4xl">
        <div className="hero-badge inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-xs font-semibold text-muted-foreground mb-6 backdrop-blur">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>Next-Generation Academic Data Management</span>
        </div>

        <h1 className="hero-title text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl mb-6">
          Empowering Institutions with <span className="bg-gradient-to-r from-primary via-indigo-500 to-blue-500 bg-clip-text text-transparent">Smart Intelligence</span>
        </h1>

        <p className="hero-subtitle text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          SDMS delivers a unified, role-based platform for managing student records, automated daily attendance, term examination results, and real-time analytical reporting.
        </p>

        <div className="hero-buttons flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            onClick={onLoginClick}
            className="w-full sm:w-auto h-12 px-8 text-base font-semibold shadow-lg hover:shadow-primary/25 transition-all group cursor-pointer"
          >
            <span>Access Portal</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              const el = document.getElementById("features-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="w-full sm:w-auto h-12 px-8 text-base font-medium cursor-pointer"
          >
            Explore Features
          </Button>
        </div>
      </div>
    </div>
  )
}
