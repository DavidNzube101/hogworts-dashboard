"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"

// Polygon shape SVG paths
const polygonShapes = [
  "M0,0 L10,0 L5,10 Z", // Triangle
  "M0,0 L10,0 L10,10 L0,10 Z", // Square
  "M0,5 L5,0 L10,5 L5,10 Z", // Diamond
  "M0,0 L10,0 L8,10 L2,10 Z", // Trapezoid
  "M0,5 L3,0 L7,0 L10,5 L7,10 L3,10 Z", // Hexagon
]

// Color palette for particles
const particleColors = [
  "#1a237e", // Dark blue
  "#283593", // Indigo
  "#3949ab", // Blue
  "#5e35b1", // Deep purple
  "#4527a0", // Dark purple
]

export default function LandingPage() {
  const router = useRouter()
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationProgress, setAnimationProgress] = useState(0)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const [isMounted, setIsMounted] = useState(false)
  const [particles, setParticles] = useState<any[]>([])

  // Set isMounted to true when component mounts and handle window size
  useEffect(() => {
    setIsMounted(true)

    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // Initial size
    updateWindowSize()

    // Generate particles after window size is set
    if (windowSize.width > 0) {
      setParticles(generateParticles())
    }

    // Handle window resize
    window.addEventListener("resize", updateWindowSize)
    return () => window.removeEventListener("resize", updateWindowSize)
  }, [])

  // Regenerate particles when window size changes
  useEffect(() => {
    if (windowSize.width > 0 && windowSize.height > 0) {
      setParticles(generateParticles())
    }
  }, [windowSize])

  // Handle the start button click
  const handleStart = () => {
    setIsAnimating(true)

    // Start loading dashboard content in the background
    const img = new Image()
    img.src = "/placeholder.svg?height=500&width=500" // Preload any assets needed
  }

  // Animation effect
  useEffect(() => {
    if (isAnimating) {
      const startTime = Date.now()
      const duration = 3000 // 3 seconds

      const animationFrame = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        setAnimationProgress(progress)

        if (progress < 1) {
          requestAnimationFrame(animationFrame)
        } else {
          // Animation complete, navigate to dashboard
          router.push("/dashboard")
        }
      }

      requestAnimationFrame(animationFrame)
    }
  }, [isAnimating, router])

  // Generate random positions for particles
  function generateParticles() {
    if (!isMounted || windowSize.width === 0) return []

    return Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      x: Math.random() * windowSize.width,
      y: Math.random() * windowSize.height,
      size: Math.random() * 20 + 10,
      rotation: Math.random() * 360,
      scale: Math.random() * 0.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.3,
      shape: polygonShapes[Math.floor(Math.random() * polygonShapes.length)],
      color: particleColors[Math.floor(Math.random() * particleColors.length)],
    }))
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Gradient Background with Animation */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#1a237e] via-[#4527a0] to-[#283593]"
        style={{
          filter: `blur(${10 + animationProgress * 40}px)`,
          transform: `scale(${1 + animationProgress * 0.2})`,
          opacity: isAnimating ? 1 - animationProgress * 0.5 : 1,
        }}
      />

      {/* Animated Polygon Particles */}
      {isMounted && (
        <div className="absolute inset-0 w-full h-full">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute"
              initial={{
                x: particle.x,
                y: particle.y,
                scale: particle.scale,
                opacity: particle.opacity,
                rotate: particle.rotation,
              }}
              animate={{
                x: Math.random() * windowSize.width,
                y: Math.random() * windowSize.height,
                scale: isAnimating ? 2 + animationProgress * 5 : particle.scale,
                opacity: isAnimating ? 0 : particle.opacity,
                rotate: particle.rotation + (isAnimating ? 360 : 180),
              }}
              transition={{
                duration: isAnimating ? 3 : Math.random() * 15 + 10,
                ease: isAnimating ? "easeInOut" : "linear",
                repeat: isAnimating ? 0 : Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            >
              <svg
                width={particle.size}
                height={particle.size}
                viewBox="0 0 10 10"
                fill={particle.color}
                opacity={particle.opacity}
              >
                <path d={particle.shape} />
              </svg>
            </motion.div>
          ))}
        </div>
      )}

      {/* Content - Centered and Full Width */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isAnimating ? 0 : 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 w-full max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight">Hogwarts</h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">Where Magic Meets Data</p>

          <div className="mt-10">
            <Button
              size="lg"
              onClick={handleStart}
              disabled={isAnimating}
              className="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 text-lg px-8 py-6 rounded-full transition-all duration-300 hover:shadow-[0_0_15px_5px_rgba(255,255,255,0.2)] border border-white/20"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Begin Your Magical Journey
            </Button>
          </div>
        </motion.div>

        {/* Loading Indicator */}
        {isAnimating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-10 left-0 right-0 flex flex-col items-center"
          >
            <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white/80 rounded-full" style={{ width: `${animationProgress * 100}%` }} />
            </div>
            <p className="text-white/70 mt-2">Preparing your magical dashboard...</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
