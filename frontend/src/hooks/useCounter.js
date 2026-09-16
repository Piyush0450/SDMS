import { useRef } from "react"
import { useGSAP, gsap } from "@/lib/gsap"

export function useCounter(endValue) {
  const containerRef = useRef(null)

  useGSAP(() => {
    if (!containerRef.current) return;
    gsap.from(".counter", {
      textContent: 0,
      duration: 2,
      ease: "power2.out",
      snap: { textContent: 1 },
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 85%",
      },
    })
  }, { scope: containerRef, dependencies: [endValue] })

  return containerRef
}
