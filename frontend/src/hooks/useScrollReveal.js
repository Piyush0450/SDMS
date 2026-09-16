import { useRef } from "react"
import { useGSAP, gsap } from "@/lib/gsap"

export function useScrollReveal(options = {}) {
  const containerRef = useRef(null)

  useGSAP(() => {
    if (!containerRef.current) return;
    gsap.from(".reveal", {
      opacity: 0,
      y: 60,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        end: "top 30%",
        toggleActions: "play none none reverse",
      },
    })
  }, { scope: containerRef })

  return containerRef
}
