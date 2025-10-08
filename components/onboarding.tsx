"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface OnboardingProps {
  onVisibilityChange?: (visible: boolean) => void
}

export function Onboarding({ onVisibilityChange }: OnboardingProps = {}) {
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("knittingpal_onboarding_seen")
    if (!hasSeenOnboarding) {
      setShowOnboarding(true)
      onVisibilityChange?.(true)
    }
  }, [onVisibilityChange])

  const handleClose = () => {
    localStorage.setItem("knittingpal_onboarding_seen", "true")
    setShowOnboarding(false)
    onVisibilityChange?.(false)
  }

  if (!showOnboarding) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="bg-card rounded-[40px] p-10 max-w-md w-full shadow-2xl border-2 border-border relative animate-in zoom-in-95 slide-in-from-bottom-8 duration-700 delay-200">
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 h-10 w-10 rounded-[20px] flex items-center justify-center hover:bg-accent transition-all duration-300 active:scale-90"
          aria-label="Close onboarding"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center space-y-6">
          <div className="text-7xl mb-4 animate-in zoom-in duration-700 delay-500">🧶</div>
          <h2 className="text-4xl font-bold text-foreground animate-in slide-in-from-bottom-4 duration-500 delay-300">Welcome to KnittingPal</h2>

          <div className="space-y-4 text-left">
            <div className="bg-gradient-to-br from-primary/15 to-primary/5 rounded-[28px] p-6 border-2 border-primary/20 animate-in slide-in-from-left duration-500 delay-400">
              <div className="text-5xl font-bold text-primary mb-3">Tap</div>
              <p className="text-foreground font-medium">Tap the big button to add a row</p>
            </div>

            <div className="bg-gradient-to-br from-secondary/15 to-secondary/5 rounded-[28px] p-6 border-2 border-secondary/20 animate-in slide-in-from-left duration-500 delay-500">
              <div className="text-2xl font-bold text-secondary mb-3">Menu</div>
              <p className="text-foreground font-medium">Use the menu button (⋮) at the top to decrease or reset</p>
            </div>

            <div className="bg-gradient-to-br from-tertiary/15 to-tertiary/5 rounded-[28px] p-6 border-2 border-tertiary/20 animate-in slide-in-from-left duration-500 delay-600">
              <div className="text-2xl font-bold text-tertiary mb-3">Projects</div>
              <p className="text-foreground font-medium">Create multiple projects and track counters for each</p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-full h-14 rounded-[28px] bg-primary text-primary-foreground font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 mt-8 animate-in slide-in-from-bottom duration-500 delay-700"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  )
}
